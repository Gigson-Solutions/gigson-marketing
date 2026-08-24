'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * gtag.js only sends a page_view when it first loads, so client-side navigations
 * are invisible to it. The Google Ads conversion action for the ISO 27001 campaign
 * is defined as a visit to /es/gracias-iso27001, and the form gets there with
 * router.push — so without this, a real form submission never counts as a conversion.
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
