'use client';

import { useEffect } from 'react';

import { captureAttribution, persistCapturedAttribution } from '../../lib/attribution';
import { COOKIE_CONSENT_EVENT } from '../../lib/cookieConsent';

/**
 * Reads the campaign parameters off the landing URL once per page load, and
 * writes them out to the cookie the moment the visitor accepts cookies.
 * Renders nothing.
 */
const AttributionCapture = () => {
  useEffect(() => {
    captureAttribution();

    window.addEventListener(COOKIE_CONSENT_EVENT, persistCapturedAttribution);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, persistCapturedAttribution);
  }, []);

  return null;
};

export default AttributionCapture;
