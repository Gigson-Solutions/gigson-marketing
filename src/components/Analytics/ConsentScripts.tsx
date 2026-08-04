'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

import { COOKIE_CONSENT_EVENT, getConsent } from '../../lib/cookieConsent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const buildConsentState = (granted: boolean) => ({
  ad_storage: granted ? 'granted' : 'denied',
  analytics_storage: granted ? 'granted' : 'denied',
  ad_user_data: granted ? 'granted' : 'denied',
  ad_personalization: granted ? 'granted' : 'denied',
});

// Google's own tags (GA4 + Google Ads) support Consent Mode v2: they always load, but
// a `consent` default of "denied" tells Google not to set ad/analytics cookies or
// personalize until the user opts in. Google can still use the resulting anonymous
// pings to *model* conversions and traffic instead of losing that data entirely —
// unlike the previous all-or-nothing gate, which sent zero signal pre-consent.
const GoogleConsentScripts = () => {
  useEffect(() => {
    const syncConsent = () => {
      const granted = getConsent() === 'accepted';
      window.gtag?.('consent', 'update', buildConsentState(granted));
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  return (
    <>
      {/* Consent Mode v2 default — must be set before gtag.js starts sending hits,
          so it runs as an inline, dependency-free script reading the raw cookie. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          var match = document.cookie.match(/(?:^|;\\s*)cookieConsent=([^;]*)/);
          var granted = match ? decodeURIComponent(match[1]) === 'accepted' : false;
          gtag('consent', 'default', {
            ad_storage: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied',
            wait_for_update: 500
          });
        `}
      </Script>

      {/* Google Analytics + Google Ads — always loaded now; Consent Mode governs
          what each tag is allowed to do based on the signal above. */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0JDRL7J7JF"
        strategy="afterInteractive"
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17149750168"
        strategy="afterInteractive"
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17165031999"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', 'G-0JDRL7J7JF');
          gtag('config', 'AW-17149750168');
          gtag('config', 'AW-17165031999');
        `}
      </Script>
    </>
  );
};

// Third-party trackers with no Consent Mode support of their own — these have no
// concept of "denied but modeled", so they keep the original behavior: nothing
// loads until the user has explicitly accepted cookies via CookieBanner.
const ThirdPartyConsentScripts = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const syncConsent = () => setAccepted(getConsent() === 'accepted');

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  if (!accepted) return null;

  return (
    <>
      {/* Microsoft Clarity */}
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ruq1vy1kce");
        `}
      </Script>

      {/* Ahrefs Web Analytics */}
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="SbrLEFG41Hv7JClirbEntQ"
        strategy="afterInteractive"
      />

      {/* Apollo.io tracker */}
      <Script id="apollo-init" strategy="afterInteractive">
        {`
          function initApollo(){
            var n=Math.random().toString(36).substring(7),o=document.createElement("script");
            o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
            o.async=true;o.defer=true;
            o.onload=function(){window.trackingFunctions.onLoad({appId:"6a0242d4ddc9400021785617"})};
            document.head.appendChild(o);
          }
          initApollo();
        `}
      </Script>
    </>
  );
};

const ConsentScripts = () => (
  <>
    <GoogleConsentScripts />
    <ThirdPartyConsentScripts />
  </>
);

export default ConsentScripts;
