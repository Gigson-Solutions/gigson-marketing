import type { Attribution } from '../attribution';
import type { LeadFormId } from './forms';

/**
 * What every lead form posts to `/api/lead`.
 *
 * Deliberately not a discriminated union per form: this is a marketing site
 * where landing pages appear every month, and a union would mean touching the
 * route, the types and the Payload schema each time. Instead a typed canonical
 * identity (the fields worth validating and querying) plus a free-form `fields`
 * bag for whatever a given form asks. The per-form rules live in `forms.ts`.
 */
export type LeadRequest = {
  /**
   * Key into LEAD_FORMS. Decides subject, recipients and which fields are
   * required. Type-only import, so the recipient addresses in forms.ts never
   * reach the client bundle.
   */
  form_id: LeadFormId;
  locale?: 'es' | 'en';
  page_path?: string;

  // Canonical identity — all optional here; LEAD_FORMS decides what's required.
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;

  /** Form-specific answers, already flattened to strings by the client. */
  fields?: Record<string, string>;

  attribution?: Attribution;

  rgpd?: boolean;

  /**
   * Honeypot. Named like a field a bot would want to fill; the visitor never
   * sees it. Anything non-empty here is a bot.
   */
  company_website?: string;

  /**
   * Epoch ms stamped when the form mounted in a real browser. A submission
   * that arrives implausibly fast — or with no stamp at all — is suspect.
   */
  rendered_at?: number;
};

/**
 * What `submitLead()` resolves to, and what the forms switch on.
 *
 * `invalidContact` is its own result rather than a plain `error`: the route
 * rejects an email whose domain cannot receive mail and a phone that could not
 * be dialled, and both are things the visitor can fix — but only if we say so.
 * Shown as a generic failure it would read as "the site is broken" and the lead
 * would be lost for good.
 */
export type LeadResult = 'sent' | 'error' | 'rateLimited' | 'invalidContact';
