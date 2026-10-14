import config from '@payload-config';
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

import { BOTID_ENFORCE } from '@/lib/botid';
import { getFormDefinition, type FormDefinition } from '@/lib/leads/forms';
import { isAllowedOrigin } from '@/lib/leads/origin';
import { isValidPhone } from '@/lib/leads/phone';
import type { LeadRequest } from '@/lib/leads/types';
import { sendLeadNotification } from '@/lib/email/sendLeadNotification';
import { verifyEmail } from '@/lib/email/verifyEmail';
import { getClientIp, isLeadRateLimited } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'leads@gigsonsolutions.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'emmelin@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

/** A real person needs longer than this to read and fill in a form. */
const MIN_FILL_MS = 3000;

// Cheap pre-filter only, run before the rate limiter so a mistyped address
// costs nothing. The real check is verifyEmail() further down, which also
// looks at disposable providers and whether the domain can receive mail at
// all — but that one does DNS, so it waits until the submission has earned it.
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

type Rejection = { kind: 'fields' | 'contact'; detail: string };

function validate(def: FormDefinition, c: Canonical): Rejection | null {
  for (const field of def.required) {
    if (!c[field]) return { kind: 'fields', detail: `missing:${field}` };
  }
  if (def.requireOneOf && !def.requireOneOf.some((field) => c[field])) {
    return {
      kind: 'fields',
      detail: `missing_one_of:${def.requireOneOf.join('|')}`,
    };
  }
  // Both checks are "only when there is one": ISO 27001 takes an email OR a
  // phone, so neither field is always present. A form that needs one has it in
  // `required` and has already been turned away above if it is missing.
  if (c.email && !EMAIL_RE.test(c.email))
    return { kind: 'contact', detail: 'invalid:email' };
  // A phone nobody can dial is worth as much as no phone at all on the forms
  // that ask for one precisely so the team can call back.
  if (c.phone && !isValidPhone(c.phone))
    return { kind: 'contact', detail: 'invalid:phone' };
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

  const def = getFormDefinition(body.form_id);
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
    return NextResponse.json(
      {
        error:
          invalid.kind === 'contact' ? 'invalid_contact' : 'invalid_fields',
        detail: invalid.detail,
      },
      { status: 400 }
    );
  }

  // Rate limit only well-formed submissions. Counting rejected ones would mean
  // a visitor who mistypes their address a few times burns the hour's quota
  // correcting it — while a bot spraying malformed bodies gets turned away by
  // the checks above for free anyway. What this caps is the expensive part:
  // the BotID call, the database write and the email.
  if (isLeadRateLimited(getClientIp(req))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // ── Is the address real? ──────────────────────────────────────────────────
  // Behind the rate limiter because it does DNS, and ahead of checkBotId()
  // because that one is billed per call. Fails open on a resolver error (see
  // verifyEmail) — a lead refused because our DNS hiccupped is not recoverable.
  if (canonical.email) {
    const verdict = await verifyEmail(canonical.email);
    if (!verdict.ok) {
      return NextResponse.json(
        { error: 'invalid_contact', detail: `email:${verdict.reason}` },
        { status: 400 }
      );
    }
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
    const emailFields: Record<string, string> = { Formulario: body.form_id };
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

    const sent = await sendLeadNotification({
      to: LEAD_EMAIL_TO,
      cc: [LEAD_EMAIL_CC, ...(def.cc ?? [])].filter(Boolean),
      replyTo: canonical.email || undefined,
      subject: def.subject,
      fields: emailFields,
    });
    emailed = sent.ok;
    if (!sent.ok) {
      // error, not warn: the lead is saved but nobody has been told about it.
      console.error('[lead] notification failed:', sent.reason);
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
