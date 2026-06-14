'use client';

import Image from 'next/image';
import React from 'react';

import logoImg from '../../../src/assets/Logo.svg';
import CookieBanner from '../../../src/CookieBanner';
import { Link } from '../../../i18n/navigation';

type Props = {
  children: React.ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <>
      <header className="flex items-center px-6 md:px-12 py-4 border-b border-neutral-100">
        <Link href="/" aria-label="Gigson Solutions — inicio">
          <Image
            src={logoImg as string}
            alt="Gigson Solutions"
            width={120}
            height={32}
            priority
          />
        </Link>
      </header>
      <main>{children}</main>
      <CookieBanner />
    </>
  );
}
