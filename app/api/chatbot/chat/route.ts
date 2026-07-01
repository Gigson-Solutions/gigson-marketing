import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { composeSystemPrompt, LEAD_FORM_MARKER, type Locale } from '@/lib/gigson';

export const runtime = 'nodejs';

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
const MAX_TURNS = 12;
const MAX_TOKENS = 280;

type Turn = { role: 'user' | 'assistant'; content: string };

// In-memory session store. Fine for a single long-lived Node process; each
// serverless cold start resets it. Swap for Redis/Upstash for real persistence.
const sessions = new Map<string, { messages: Turn[]; updatedAt: number }>();
const SESSION_TTL_MS = 30 * 60 * 1000;

function pruneSessions() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, s] of sessions) {
    if (s.updatedAt < cutoff) sessions.delete(id);
  }
}

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export async function POST(req: Request) {
  let payload: { message?: string; sessionId?: string; locale?: string; pagePath?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = payload.message?.trim();
  const sessionId = payload.sessionId?.trim();
  const locale: Locale = payload.locale === 'en' ? 'en' : 'es';
  const pagePath =
    typeof payload.pagePath === 'string' ? payload.pagePath.slice(0, 256) : undefined;
  if (!message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 413 });
  }

  const anthropic = getClient();
  if (!anthropic) {
    return NextResponse.json(
      {
        reply:
          'El chatbot aún no tiene la ANTHROPIC_API_KEY configurada. Define la variable de entorno y reinicia el servidor.',
      },
      { status: 200 },
    );
  }

  pruneSessions();
  const session = sessions.get(sessionId) ?? { messages: [], updatedAt: Date.now() };
  session.messages.push({ role: 'user', content: message });
  // Keep the conversation bounded
  if (session.messages.length > MAX_TURNS) {
    session.messages = session.messages.slice(-MAX_TURNS);
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: composeSystemPrompt({ locale, pagePath }),
      messages: session.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    let reply = '';
    for (const block of response.content) {
      if (block.type === 'text') reply += block.text;
    }
    reply = reply.trim();

    const shouldOpenLeadForm = reply.includes(LEAD_FORM_MARKER);
    if (shouldOpenLeadForm) {
      reply = reply.replace(LEAD_FORM_MARKER, '').trim();
    }

    if (!reply) {
      reply =
        'Perdona, no he sabido qué responder. ¿Puedes contarme un poco más sobre lo que necesitas?';
    }

    session.messages.push({ role: 'assistant', content: reply });
    session.updatedAt = Date.now();
    sessions.set(sessionId, session);

    return NextResponse.json({ reply, shouldOpenLeadForm });
  } catch (err) {
    // Drop the user's last turn from history so the next retry isn't confused
    session.messages.pop();
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Has enviado demasiados mensajes. Espera un momento.' },
        { status: 429 },
      );
    }
    console.error('[chatbot] anthropic error', err);
    return NextResponse.json(
      {
        reply:
          'Disculpa, ahora mismo no puedo responder. Escríbenos a info@gigsonsolutions.com y te contactamos.',
      },
      { status: 200 },
    );
  }
}
