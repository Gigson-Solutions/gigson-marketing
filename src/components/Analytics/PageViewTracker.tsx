'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * gtag.js only sends a page_view when it first loads, so client-side navigations
 * are invisible to it. Every lead form redirects to the shared thank-you page
 * (/es/gracias, /thank-you) with router.push, and a visit to that page is what
 * Google Ads counts as a conversion — so without this, a real form submission
 * never counts as one. The redirect carries `?form=<form_id>`, so a conversion
 * action can count a single form with a "URL contains" rule, e.g.
 * `gracias?form=iso27001`.
 * Renders nothing.
 */
const PageViewTracker = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // gtag('config') already sent a page_view for the page the session started on.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
};

export default PageViewTracker;
