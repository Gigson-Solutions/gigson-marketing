import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Same delivery mechanism as the marketing contact form (src/components/Form.tsx):
// FormSubmit.co forwards the submission as an email. The recipient is already
// activated there, so reusing it skips FormSubmit's confirmation step.
const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'jaume@somosgigson.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'alfonso.ojeda@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

type TranscriptTurn = { role: unknown; text: unknown };

/** Formats the conversation history into a readable transcript for the email. */
function formatTranscript(transcript: unknown): string {
  if (!Array.isArray(transcript)) return '';
  const lines: string[] = [];
  for (const turn of transcript as TranscriptTurn[]) {
    if (!turn || typeof turn !== 'object') continue;
    const text = typeof turn.text === 'string' ? turn.text.trim() : '';
    if (!text) continue;
    const who = turn.role === 'user' ? 'Cliente' : 'Alfonso';
    lines.push(`${who}: ${text}`);
  }
  // Bound the size so a long chat can't produce a giant email.
  return lines.join('\n\n').slice(0, 8000);
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { name, email, company, message, source, sessionId, locale, pagePath, transcript, rgpd, website } =
    payload as Record<string, unknown>;

  // Honeypot: silently accept bots without sending anything.
  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true, reference: '00000000' });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !rgpd
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const lead = {
    name: name.slice(0, 200),
    email,
    company: typeof company === 'string' ? company.slice(0, 200) : null,
    message: message.slice(0, 5000),
    source: typeof source === 'string' && source.length > 0 ? source.slice(0, 100) : 'gigson-chatbot',
    sessionId: typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : null,
    locale: locale === 'en' ? 'en' : 'es',
    pagePath: typeof pagePath === 'string' && pagePath.length > 0 ? pagePath.slice(0, 256) : null,
    conversation: formatTranscript(transcript),
    receivedAt: new Date().toISOString(),
  };

  console.log('[gigson-chatbot] lead received:', { ...lead, conversation: `${lead.conversation.length} chars` });

  if (LEAD_EMAIL_DISABLE) {
    return NextResponse.json({ ok: true, reference: null });
  }

  // Build the email body fields. FormSubmit renders each field as a row.
  const emailFields: Record<string, string> = {
    _subject: `Nuevo lead del chatbot — ${lead.name}`,
    _cc: LEAD_EMAIL_CC,
    _captcha: 'false',
    _template: 'box',
    _replyto: lead.email,
    Nombre: lead.name,
    Email: lead.email,
    Empresa: lead.company ?? '—',
    Idioma: lead.locale,
    'Página': lead.pagePath ?? '—',
    Mensaje: lead.message,
    'Resumen de la conversación': lead.conversation || '(sin conversación previa)',
    Origen: lead.source,
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(LEAD_EMAIL_TO)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(emailFields),
    });

    if (!res.ok) {
      console.error('[gigson-chatbot] FormSubmit error', res.status, await res.text().catch(() => ''));
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, reference: null });
  } catch (err) {
    console.error('[gigson-chatbot] FormSubmit request failed', err);
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
  }
}
