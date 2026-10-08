/**
 * Lead notifications, sent through Resend.
 *
 * Replaces formsubmit.co, which cannot be called from a server at all:
 * formsubmit.co sits behind Cloudflare and answers any server-to-server
 * request with a 403 JavaScript challenge ("Just a moment..."). It worked for
 * years only because the forms POSTed from the visitor's own browser. The
 * moment every form moved to /api/lead, every notification stopped arriving —
 * silently, because the routes treat email as best-effort and the lead was
 * already safe in Payload. A real lead (EPICSA, 2026-09-09) sat unseen for a
 * month that way.
 *
 * Called over plain fetch rather than the `resend` SDK on purpose: this is one
 * POST to a stable endpoint, and it keeps the dependency surface — and the
 * lockfile — untouched.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Until gigsonsolutions.com is verified in Resend, this stays on Resend's
 * shared test domain, which only delivers to the address that owns the Resend
 * account. Set LEAD_EMAIL_FROM to a verified address to reach anyone else —
 * the CC recipients included.
 */
const FROM = process.env.LEAD_EMAIL_FROM ?? 'Gigson Leads <onboarding@resend.dev>';

export type LeadNotification = {
  to: string;
  subject: string;
  /** Ordered label → value pairs, rendered as the body. Empty values are dropped. */
  fields: Record<string, string>;
  replyTo?: string;
  cc?: string[];
};

/**
 * Never throws and never rejects: a notification failure must not fail the
 * request that produced the lead. Callers get a result they can log and stamp
 * instead of a surprise — the whole point is that a failure stops being silent.
 */
export type SendResult = { ok: true; id: string } | { ok: false; reason: string };

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderHtml = (fields: Array<[string, string]>): string =>
  `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666;white-space:nowrap">${escapeHtml(
          label,
        )}</td><td style="padding:4px 0;vertical-align:top;white-space:pre-wrap">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join('')}</table>`;

const renderText = (fields: Array<[string, string]>): string =>
  fields.map(([label, value]) => `${label}: ${value}`).join('\n');

export async function sendLeadNotification(notification: LeadNotification): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: 'RESEND_API_KEY is not set' };

  const fields = Object.entries(notification.fields).filter(([, value]) => value && value.trim());

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [notification.to],
        ...(notification.cc?.length ? { cc: notification.cc } : {}),
        ...(notification.replyTo ? { reply_to: notification.replyTo } : {}),
        subject: notification.subject,
        html: renderHtml(fields),
        text: renderText(fields),
      }),
    });

    if (!res.ok) {
      // Resend answers with a JSON body explaining the refusal (unverified
      // domain, bad key, invalid recipient). Keep it: that text is the whole
      // difference between "it broke" and knowing why.
      return { ok: false, reason: `${res.status} ${await res.text().catch(() => '')}`.trim() };
    }

    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: data?.id ?? '(no id returned)' };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
}
