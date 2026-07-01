import React from 'react';

import CookieBanner from '../../../src/CookieBanner';
import GigsonChatLauncher from '../../../src/components/Chatbot/GigsonChatLauncher';
import Footer from '../../../src/components/Footer/Footer';
import Navbar from '../../../src/components/Navbar/Navbar';

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
      <GigsonChatLauncher />
    </>
  );
}
