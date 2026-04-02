import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CookieBanner from '../../CookieBanner';
import ScrollTop from '../../hooks/ScrollTop';
import Whatsapp from '../../shared/ui/WhatssapButton';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../../router/routerSlugs';

const holdedIntegrationsPath = (lang) =>
  lang === DEFAULT_LANG
    ? `/${ROUTE_SLUGS[lang].integrations}`
    : `/${lang}/${ROUTE_SLUGS[lang].integrations}`;

const Layout = () => {
  const { pathname } = useLocation();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const holdedHost =
    host === 'integrations.gigsonsolutions.com' || host === 'staging.gigsonsolutions.com';
  /** Raíz EN/ES en integrations/staging: igual que /landing-holded (sin navbar/footer). */
  const onHoldedIntegrationsSlug =
    pathname === holdedIntegrationsPath('en') || pathname === holdedIntegrationsPath('es');
  const fullBleed =
    (holdedHost && (pathname === '/' || pathname === '/es')) || onHoldedIntegrationsSlug;

  if (fullBleed) {
    return (
      <ScrollTop>
        <Outlet />
      </ScrollTop>
    );
  }

  return (
    <ScrollTop>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner /> {}
      <Whatsapp />
    </ScrollTop>
  );
};

export default Layout;
