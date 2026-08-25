import Cookies from 'js-cookie';

import { getConsent } from './cookieConsent';

/**
 * Captures where a visitor came from so every lead submission can carry its
 * origin. Without this, FormSubmit emails arrive with no way to tell an ad
 * click from organic traffic.
 *
 * The click identifiers only ever appear in the URL of the landing page and
 * are gone as soon as the visitor navigates, so they are held here and
 * replayed into whichever form is eventually submitted.
 */

export const ATTRIBUTION_COOKIE = 'gsAttribution';

// Matches the Google Ads conversion window: a click older than this can no
// longer be tied to a conversion, so keeping it around serves no purpose.
const COOKIE_DAYS = 90;

/** Parameters read straight from the landing URL. */
const URL_PARAMS = [
  'gclid', // Google Ads click id — the one that enables offline conversion import
  'gbraid', // replaces gclid on iOS app-to-web traffic
  'wbraid', // replaces gclid on some YouTube/iOS formats
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

/** Everything sent with a form, including the two derived from the browser. */
export const ATTRIBUTION_FIELDS = [...URL_PARAMS, 'referrer', 'landing_page'] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type Attribution = Partial<Record<AttributionField, string>>;

/**
 * Survives client-side navigation and, unlike the cookie, is available before
 * the visitor has answered the cookie banner — so a same-page submit still
 * carries its attribution even without consent.
 */
let memory: Attribution | undefined;

const readCookie = (): Attribution => {
  const raw = Cookies.get(ATTRIBUTION_COOKIE);
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};

    const result: Attribution = {};
    for (const field of ATTRIBUTION_FIELDS) {
      const value = (parsed as Record<string, unknown>)[field];
      if (typeof value === 'string' && value) result[field] = value;
    }
    return result;
  } catch {
    return {};
  }
};

/**
 * Attribution is a marketing-purpose cookie, so it is only ever written once
 * the visitor has accepted — consistent with how the third-party trackers are
 * gated in ConsentScripts. Until then the values live in memory only.
 */
const persist = (value: Attribution) => {
  if (getConsent() !== 'accepted') return;

  Cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(value), {
    expires: COOKIE_DAYS,
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  });
};

/**
 * Reads the current URL and merges anything found into what is already known.
 * Empty parameters never overwrite a stored value, so navigating to a page
 * without a `gclid` does not erase the one captured on arrival.
 */
export const captureAttribution = (): Attribution => {
  const stored = memory ?? readCookie();
  const incoming: Attribution = {};

  const params = new URLSearchParams(window.location.search);
  for (const param of URL_PARAMS) {
    const value = params.get(param)?.trim();
    if (value) incoming[param] = value;
  }

  const next: Attribution = { ...stored, ...incoming };

  // A URL carrying campaign parameters is a new visit from a new source, so
  // the entry point is refreshed alongside them. Otherwise it is only filled
  // in when missing, to keep the original landing page of the visit.
  const isNewTouch = Object.keys(incoming).length > 0;
  if (isNewTouch || !next.landing_page) {
    next.landing_page = window.location.pathname;

    const referrer = document.referrer;
    next.referrer =
      referrer && !referrer.startsWith(window.location.origin) ? referrer : 'direct';
  }

  memory = next;
  persist(next);
  return next;
};

export const getAttribution = (): Attribution => memory ?? readCookie();

/**
 * Called when the visitor accepts cookies, so whatever was captured earlier in
 * the visit is written out instead of being lost on the next reload.
 */
export const persistCapturedAttribution = () => {
  if (memory) persist(memory);
};
