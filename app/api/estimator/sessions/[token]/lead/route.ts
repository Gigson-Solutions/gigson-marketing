import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { featuresFromPayload } from '@/lib/estimator/payloadMapping';
import { isValidEmail } from '@/lib/estimator/validate';
import { getSessionByToken, updateSession } from '@/lib/estimator/session';

export const runtime = 'nodejs';

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? 'jaume@somosgigson.com';
const LEAD_EMAIL_CC = process.env.LEAD_EMAIL_CC ?? 'emmelin@gigsonsolutions.com';
const LEAD_EMAIL_DISABLE = process.env.LEAD_EMAIL_DISABLE === 'true';

// Email-capture gate on step 6: persists the lead, reveals the real
// totalHours/totalBudget (previously withheld), and — best-effort, matching
// app/api/chatbot/email/route.ts — notifies Gigson's team with the FULL
// generated estimate so a human can personally follow up. This is what
// reconciles "show the lead an instant AI estimate" with the original ask
// of "leads send us info so we can contact them with the final result."
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { email, name, company, rgpd, website } = (body as Record<string, unknown>) ?? {};

  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true, totals: { totalHours: 0, totalBudget: 0 } });
  }

  if (typeof email !== 'string' || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (!rgpd) {
    return NextResponse.json({ error: 'RGPD consent required' }, { status: 400 });
  }

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const totals = { totalHours: session.totalHours ?? 0, totalBudget: session.totalBudget ?? 0 };

  try {
    await updateSession(payloadClient, session.id, {
      status: 'completed',
      leadEmail: email.slice(0, 200),
      leadName: typeof name === 'string' ? name.slice(0, 200) : undefined,
      leadCompany: typeof company === 'string' ? company.slice(0, 200) : undefined,
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
            `${i + 1}. ${f.name} — Frontend ${f.hours.frontend}h / Backend ${f.hours.backend}h / QA ${f.hours.qa}h / UI-UX ${f.hours.uiux}h / BA-PM ${f.hours.bapm}h`,
        )
        .join('\n');

      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(LEAD_EMAIL_TO)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Nuevo lead del estimador de proyectos — ${name || email}`,
          _cc: LEAD_EMAIL_CC,
          _captcha: 'false',
          _template: 'box',
          _replyto: email,
          Nombre: name || '—',
          Email: email,
          Empresa: company || '—',
          'Descripción del proyecto': session.projectDescription ?? '—',
          Dominio: session.businessDomain ?? '—',
          'Tarifa asumida': `€${session.hourlyRate ?? '—'}/h`,
          'Horas totales': String(totals.totalHours),
          'Presupuesto total': `€${totals.totalBudget}`,
          Funcionalidades: featuresSummary || '(sin funcionalidades)',
          Origen: 'project-estimator',
        }),
      });
      if (!res.ok) {
        console.warn('[estimator] FormSubmit returned non-ok:', res.status, await res.text().catch(() => ''));
      } else {
        await updateSession(payloadClient, session.id, { teamNotifiedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('[estimator] FormSubmit request failed (non-critical):', err);
    }
  }

  return NextResponse.json({ ok: true, totals });
}
