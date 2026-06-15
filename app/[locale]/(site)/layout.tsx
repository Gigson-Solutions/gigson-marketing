import React from 'react';

import CookieBanner from '../../../src/CookieBanner';
import Footer from '../../../src/components/Footer/Footer';
import Navbar from '../../../src/components/Navbar/Navbar';
import WhatsappButton from '../../../src/shared/ui/WhatssapButton';

type Props = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
      <WhatsappButton />
    </>
  );
}
