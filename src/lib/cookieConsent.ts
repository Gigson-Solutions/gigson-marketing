import Cookies from 'js-cookie';

export const COOKIE_CONSENT_KEY = 'cookieConsent';
export const COOKIE_CONSENT_EVENT = 'cookie-consent-change';

export type ConsentValue = 'accepted' | 'rejected';

export const getConsent = (): ConsentValue | undefined =>
  Cookies.get(COOKIE_CONSENT_KEY) as ConsentValue | undefined;

export const setConsent = (value: ConsentValue) => {
  Cookies.set(COOKIE_CONSENT_KEY, value, { expires: 365 });
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
};

// Clears the stored choice so the banner is shown again and tracking scripts
// stop being (re-)injected. Already-loaded third-party scripts from this
// session are not retroactively unloaded; a full effect requires a reload.
export const resetConsent = () => {
  Cookies.remove(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
};
