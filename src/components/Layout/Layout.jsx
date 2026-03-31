import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CookieBanner from '../../CookieBanner';
import ScrollTop from '../../hooks/ScrollTop';
import Whatsapp from '../../shared/ui/WhatssapButton';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const Layout = () => {
  const { pathname } = useLocation();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const holdedHost =
    host === 'integrations.gigsonsolutions.com' || host === 'staging.gigsonsolutions.com';
  /** Raíz EN/ES en integrations/staging: igual que /landing-holded (sin navbar/footer). */
  const fullBleed = holdedHost && (pathname === '/' || pathname === '/es');

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
