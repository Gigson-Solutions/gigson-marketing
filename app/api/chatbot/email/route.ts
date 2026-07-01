import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'jaume@somosgigson.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'alfonso.ojeda@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

type TranscriptTurn = { role: unknown; text: unknown };

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

  // Honeypot: silently accept bots without saving anything.
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
    company: typeof company === 'string' ? company.slice(0, 200) : undefined,
    message: message.slice(0, 5000),
    source: typeof source === 'string' && source.length > 0 ? source.slice(0, 100) : 'gigson-chatbot',
    sessionId: typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : undefined,
    locale: (locale === 'en' ? 'en' : 'es') as 'en' | 'es',
    pagePath: typeof pagePath === 'string' && pagePath.length > 0 ? pagePath.slice(0, 256) : undefined,
    conversation: formatTranscript(transcript),
    rgpd: Boolean(rgpd),
  };

  // ── 1. Save to Payload / Neon (primary — source of truth) ──────────────────
  let savedToDb = false;
  try {
    const payloadClient = await getPayload({ config });
    await payloadClient.create({
      collection: 'chatbot-leads',
      data: {
        name: lead.name,
        email: lead.email,
        company: lead.company ?? null,
        message: lead.message,
        conversation: lead.conversation || null,
        locale: lead.locale,
        pagePath: lead.pagePath ?? null,
        source: lead.source,
        sessionId: lead.sessionId ?? null,
        rgpd: lead.rgpd,
      },
    });
    savedToDb = true;
    console.log('[gigson-chatbot] lead saved to DB:', { name: lead.name, email: lead.email, sessionId: lead.sessionId });
  } catch (dbErr) {
    // Log but don't abort — we still try email below
    console.error('[gigson-chatbot] DB save failed:', dbErr);
  }

  // ── 2. Send email notification via FormSubmit (secondary / best-effort) ────
  if (!LEAD_EMAIL_DISABLE) {
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
      Página: lead.pagePath ?? '—',
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
        console.warn('[gigson-chatbot] FormSubmit returned non-ok:', res.status, await res.text().catch(() => ''));
      }
    } catch (emailErr) {
      // Email is best-effort: log but never fail the request because of it.
      console.warn('[gigson-chatbot] FormSubmit request failed (non-critical):', emailErr);
    }
  }

  // Return ok as long as we attempted to save (even if DB failed, we logged it)
  if (!savedToDb && !LEAD_EMAIL_DISABLE) {
    // Both paths failed — return error so the user knows to retry
    return NextResponse.json({ error: 'Could not save lead. Please try again.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true, reference: null });
}
