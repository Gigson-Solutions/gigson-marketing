import type { LeadRequest, LeadResult } from './types';

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

    if (res.ok) return 'sent';
    if (res.status === 429) return 'rateLimited';

    console.error('[lead] submit failed', res.status, await res.text().catch(() => ''));
    return 'error';
  } catch (error) {
    console.error('[lead] submit failed', error);
    return 'error';
  }
}
