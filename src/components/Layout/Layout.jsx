import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CookieBanner from '../../CookieBanner';
import ScrollTop from '../../hooks/ScrollTop';
import Whatsapp from '../../shared/ui/WhatssapButton';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../../router/routerSlugs';

const holdedIntegrationsPath = (lang) => {
  const slug = ROUTE_SLUGS[lang]?.integrations;
  if (!slug) return null;
  return lang === DEFAULT_LANG ? `/${slug}` : `/${lang}/${slug}`;
};

const Layout = () => {
  const { pathname } = useLocation();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const holdedHost = host === 'staging.gigsonsolutions.com';
  const onHoldedIntegrationsSlug =
    ['en', 'es'].some((l) => holdedIntegrationsPath(l) && pathname === holdedIntegrationsPath(l));
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
