import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { shouldBlockAsBot } from '@/lib/botid';
import { sendLeadNotification } from '@/lib/email/sendLeadNotification';
import { verifyEmail } from '@/lib/email/verifyEmail';
import { featuresFromPayload } from '@/lib/estimator/payloadMapping';
import { getSessionByToken, updateSession } from '@/lib/estimator/session';
import { isValidPhone, normalizePhone } from '@/lib/leads/phone';

export const runtime = 'nodejs';

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'jaume@somosgigson.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'emmelin@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

// Email-capture gate on step 6: persists the lead, reveals the real
// totalBudget (previously withheld), and — best-effort, matching
// app/api/chatbot/email/route.ts — notifies Gigson's team with the FULL
// generated estimate (including totalHours) so a human can personally
// follow up. This is what reconciles "show the lead an instant AI
// estimate" with the original ask of "leads send us info so we can
// contact them with the final result."
//
// No hour figure is sent to the client here — hours stay hidden (blurred
// in the UI) until the user also books a call via the Cal.com embed further
// down Step 6; see book-confirmed/route.ts.
//
// Every 400 carries a stable `code` so the modal can show a translated
// message (LeadCaptureModal maps codes → projectEstimator.step6.modal keys);
// `error` is an English fallback for anything that isn't the modal.
const MAX_FIELD = 200;

function reject(code: string, error: string) {
  return NextResponse.json({ error, code }, { status: 400 });
}

function requiredString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, MAX_FIELD) : null;
}

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { email, name, company, phone, rgpd, website } = (body as Record<string, unknown>) ?? {};

  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true, totalBudget: 0 });
  }

  // Bot check. Placed after the honeypot so an obvious bot never reaches it,
  // and observe-only until BOTID_ENFORCE is turned on — until then a wrong
  // verdict about a real visitor is logged, not a lost lead.
  if (await shouldBlockAsBot('/api/estimator/sessions/[token]/lead')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Same order as the client-side checks so a direct POST gets the same
  // first error a visitor would.
  const leadName = requiredString(name);
  if (!leadName) return reject('name_required', 'Name is required');
  const leadCompany = requiredString(company);
  if (!leadCompany) return reject('company_required', 'Company is required');
  if (typeof phone !== 'string' || !isValidPhone(phone)) {
    return reject('phone_invalid', 'A valid phone number is required');
  }
  const leadPhone = normalizePhone(phone).slice(0, 32);

  if (typeof email !== 'string') return reject('email_invalid', 'Invalid email');
  const leadEmail = email.trim().slice(0, MAX_FIELD);
  const verdict = await verifyEmail(leadEmail);
  if (!verdict.ok) {
    if (verdict.reason === 'syntax') return reject('email_invalid', 'Invalid email');
    if (verdict.reason === 'disposable') {
      return reject('email_disposable', 'Disposable email addresses are not accepted');
    }
    return reject('email_no_mx', 'That email domain cannot receive mail');
  }

  if (!rgpd) return reject('rgpd_required', 'RGPD consent required');

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const totals = { totalHours: session.totalHours ?? 0, totalBudget: session.totalBudget ?? 0 };

  try {
    await updateSession(payloadClient, session.id, {
      status: 'completed',
      leadEmail,
      leadName,
      leadCompany,
      leadPhone,
      rgpd: true,
      leadCapturedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[estimator] failed to persist lead', err);
    return NextResponse.json({ error: 'Could not save your details. Please try again.' }, { status: 503 });
  }

  if (!LEAD_EMAIL_DISABLE) {
    try {
      const features = featuresFromPayload(session.features);
      const featuresSummary = features
        .map(
          (f, i) =>
            `${i + 1}. ${f.name} — Consultoría ${f.hours.consulting}h / Desarrollo ${f.hours.building}h`,
        )
        .join('\n');

      const sent = await sendLeadNotification({
        to: LEAD_EMAIL_TO,
        cc: [LEAD_EMAIL_CC].filter(Boolean),
        replyTo: leadEmail,
        subject: `Nuevo lead del estimador de proyectos — ${leadName}`,
        fields: {
          Nombre: leadName,
          Email: leadEmail,
          Teléfono: leadPhone,
          Empresa: leadCompany,
          'Descripción del proyecto': session.projectDescription ?? '—',
          Dominio: session.businessDomain ?? '—',
          'Tarifa asumida': `€${session.hourlyRate ?? '—'}/h`,
          'Horas totales': String(totals.totalHours),
          'Presupuesto total': `€${totals.totalBudget}`,
          Funcionalidades: featuresSummary || '(sin funcionalidades)',
          Origen: 'project-estimator',
        },
      });
      if (sent.ok) {
        await updateSession(payloadClient, session.id, { teamNotifiedAt: new Date().toISOString() });
      } else {
        // error, not warn: teamNotifiedAt stays null and nobody has been told.
        console.error('[estimator] notification failed:', sent.reason);
      }
    } catch (err) {
      console.error('[estimator] notification threw:', err);
    }
  }

  return NextResponse.json({ ok: true, totalBudget: totals.totalBudget });
}
