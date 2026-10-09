import type { LeadRequest, LeadResult } from './types';

/**
 * Announces a successful lead to the GTM container (GTM-5GP9PB8B), which is the
 * only place a conversion tag can be wired without a deploy.
 *
 * This is the one hook every form shares, so pushing here covers Home, Contacto,
 * the three Integrations forms and ISO 27001 at once. `form_id` rides along so a
 * GTM trigger can fire per form rather than all-or-nothing.
 *
 * Careful: after this event every form ALSO redirects to the shared thank-you
 * page (/es/gracias, /thank-you), and that page view can be used as the Google
 * Ads conversion (see PageViewTracker). Use one or the other for a given
 * conversion action, never both, or each lead is counted twice. The event is
 * the one to use when a conversion should only count a specific form_id.
 *
 * Fires only on a confirmed 200 — never on a rejected, rate-limited or failed
 * submission, so the event means "the lead was accepted", not "someone clicked".
 */
function announceLead(formId: string): void {
  if (typeof window === 'undefined') return;
  // The array is created by the consent-default script in ConsentScripts.tsx,
  // which runs beforeInteractive — but this must not throw if that ever changes.
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: 'lead_submitted', form_id: formId });
}

/**
 * The single client-side entry point for every lead form.
 *
 * Forms used to POST straight to formsubmit.co — either natively (which
 * navigated the visitor off-site to FormSubmit's own thank-you page) or by
 * fetch. They now all go through our own route, so the recipient address stays
 * server-side and the submission can actually be checked.
 */
export async function submitLead(payload: LeadRequest): Promise<LeadResult> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      announceLead(payload.form_id);
      return 'sent';
    }
    if (res.status === 429) return 'rateLimited';

    console.error('[lead] submit failed', res.status, await res.text().catch(() => ''));
    return 'error';
  } catch (error) {
    console.error('[lead] submit failed', error);
    return 'error';
  }
}
