import config from '@payload-config';
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

import { BOTID_ENFORCE } from '@/lib/botid';
import { LEAD_FORMS, type FormDefinition } from '@/lib/leads/forms';
import { isAllowedOrigin } from '@/lib/leads/origin';
import type { LeadRequest } from '@/lib/leads/types';
import { getClientIp, isLeadRateLimited } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'leads@gigsonsolutions.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'emmelin@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

/** A real person needs longer than this to read and fill in a form. */
const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/**
 * Maps the snake_case attribution field names (ATTRIBUTION_FIELDS in
 * src/lib/attribution.ts) onto this collection's columns. Spelled out here
 * rather than imported, because that module is client-side — it pulls in
 * js-cookie and reads `window`, and none of that belongs in a route handler.
 */
const ATTRIBUTION_COLUMNS: Record<string, string> = {
  gclid: 'gclid',
  gbraid: 'gbraid',
  wbraid: 'wbraid',
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_term: 'utmTerm',
  utm_content: 'utmContent',
  referrer: 'referrer',
  landing_page: 'landingPage',
};

type Canonical = { name: string; email: string; phone: string; company: string; message: string };

function validate(def: FormDefinition, c: Canonical): string | null {
  for (const field of def.required) {
    if (!c[field]) return `missing:${field}`;
  }
  if (def.requireOneOf && !def.requireOneOf.some((field) => c[field])) {
    return `missing_one_of:${def.requireOneOf.join('|')}`;
  }
  // Only validate the address when there is one — ISO 27001 allows phone only.
  if (c.email && !EMAIL_RE.test(c.email)) return 'invalid:email';
  return null;
}

export async function POST(req: Request) {
  // A cross-origin <form> can't send application/json without a CORS preflight,
  // so this rules out the cheapest kind of forged submission at zero cost.
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'unsupported_media_type' }, { status: 415 });
  }

  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: LeadRequest;
  try {
    body = (await req.json()) as LeadRequest;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const def = LEAD_FORMS[body.form_id];
  if (!def) {
    return NextResponse.json({ error: 'unknown_form' }, { status: 400 });
  }

  // Honeypot — answer 200 so the bot learns nothing, but store nothing.
  if (typeof body.company_website === 'string' && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const canonical: Canonical = {
    name: str(body.name, 200),
    email: str(body.email, 320).toLowerCase(),
    phone: str(body.phone, 50),
    company: str(body.company, 200),
    message: str(body.message, 5000),
  };

  const invalid = validate(def, canonical);
  if (invalid) {
    return NextResponse.json({ error: 'invalid_fields', detail: invalid }, { status: 400 });
  }

  // Rate limit only well-formed submissions. Counting rejected ones would mean
  // a visitor who mistypes their address a few times burns the hour's quota
  // correcting it — while a bot spraying malformed bodies gets turned away by
  // the checks above for free anyway. What this caps is the expensive part:
  // the BotID call, the database write and the email.
  if (isLeadRateLimited(getClientIp(req))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // ── Bot signals ───────────────────────────────────────────────────────────
  // Last, because BotID Deep Analysis is billed per checkBotId() call — the
  // free checks above have already turned away the cheap traffic.
  const spamReasons: string[] = [];

  const verification = await checkBotId();
  if (verification.isBot) {
    if (BOTID_ENFORCE) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    spamReasons.push('botid');
  }

  if (!body.rendered_at || Date.now() - body.rendered_at < MIN_FILL_MS) {
    spamReasons.push('too_fast');
  }

  // ── Normalise the rest ────────────────────────────────────────────────────
  const extra: Record<string, string> = {};
  if (body.fields && typeof body.fields === 'object') {
    for (const [key, value] of Object.entries(body.fields)) {
      const clean = str(value, 2000);
      if (clean) extra[key] = clean;
    }
  }

  const attribution: Record<string, string> = {};
  if (body.attribution && typeof body.attribution === 'object') {
    for (const [field, column] of Object.entries(ATTRIBUTION_COLUMNS)) {
      const clean = str((body.attribution as Record<string, unknown>)[field], 500);
      if (clean) attribution[column] = clean;
    }
  }

  const isSpam = spamReasons.length > 0;
  const shouldEmail = !isSpam && !LEAD_EMAIL_DISABLE;

  // ── 1. Persist first — the database is the source of truth ────────────────
  // Spam-marked rows are stored too: no heuristic added here should ever be
  // able to lose a real lead silently.
  let savedToDb = false;
  let leadId: string | number | null = null;
  try {
    const payloadClient = await getPayload({ config });
    const created = await payloadClient.create({
      collection: 'leads',
      data: {
        formId: body.form_id,
        status: isSpam ? 'spam' : 'new',
        spamReasons: isSpam ? spamReasons.join(', ') : null,
        name: canonical.name || null,
        email: canonical.email || null,
        phone: canonical.phone || null,
        company: canonical.company || null,
        message: canonical.message || null,
        extra: Object.keys(extra).length > 0 ? extra : null,
        locale: body.locale === 'en' ? 'en' : 'es',
        pagePath: str(body.page_path, 256) || null,
        rgpd: Boolean(body.rgpd),
        // Filled in below, only once the email has actually been accepted —
        // claiming it up front would make the admin lie about leads that were
        // stored but never reached an inbox.
        notifiedAt: null,
        ...attribution,
      },
    });
    leadId = created?.id ?? null;
    savedToDb = true;
  } catch (dbErr) {
    console.error('[lead] DB save failed:', dbErr);
  }

  // ── 2. Notify by email (best-effort) ──────────────────────────────────────
  let emailed = false;
  if (shouldEmail) {
    const emailFields: Record<string, string> = {
      _subject: def.subject,
      _cc: [LEAD_EMAIL_CC, ...(def.cc ?? [])].filter(Boolean).join(','),
      _template: 'box',
      // Correct here in a way it never was in the page: this is a
      // server-to-server call to a recipient the public can't see, and the
      // bot checks above have already run. FormSubmit's own captcha would
      // just fail an AJAX call from a server.
      _captcha: 'false',
      Formulario: body.form_id,
    };
    if (canonical.email) emailFields._replyto = canonical.email;
    if (canonical.name) emailFields.Nombre = canonical.name;
    if (canonical.email) emailFields.Email = canonical.email;
    if (canonical.phone) emailFields['Teléfono'] = canonical.phone;
    if (canonical.company) emailFields.Empresa = canonical.company;
    if (canonical.message) emailFields.Mensaje = canonical.message;
    for (const [key, value] of Object.entries(extra)) {
      emailFields[def.labels?.[key] ?? key] = value;
    }
    for (const [field, column] of Object.entries(ATTRIBUTION_COLUMNS)) {
      if (attribution[column]) emailFields[field] = attribution[column];
    }
    emailFields['Página'] = str(body.page_path, 256) || '—';

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(LEAD_EMAIL_TO)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(emailFields),
      });
      emailed = res.ok;
      if (!res.ok) {
        console.warn('[lead] FormSubmit non-ok:', res.status, await res.text().catch(() => ''));
      }
    } catch (emailErr) {
      // Email is best-effort: the lead is already in the database.
      console.warn('[lead] FormSubmit request failed (non-critical):', emailErr);
    }
  }

  if (emailed && leadId !== null) {
    try {
      const payloadClient = await getPayload({ config });
      await payloadClient.update({
        collection: 'leads',
        id: leadId,
        data: { notifiedAt: new Date().toISOString() },
      });
    } catch (stampErr) {
      // Cosmetic only — the lead and the email both already went out.
      console.warn('[lead] could not stamp notifiedAt:', stampErr);
    }
  }

  // Only fail the request if the lead reached neither the database nor an
  // inbox — otherwise the visitor would be told to retry something that worked.
  if (!savedToDb && !emailed) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
