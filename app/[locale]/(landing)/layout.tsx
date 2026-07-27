'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import '../../../src/components/Footer/Footer.css';
import '../../../src/components/Footer/LandingFooter.css';
import logoImg from '../../../src/assets/Logo.svg';
import logoFooter from '../../../src/assets/LogoFooter.svg';
import CookieBanner from '../../../src/CookieBanner';
import type { AppPathnames } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';

type Props = {
  children: React.ReactNode;
};

type NavPathname = Exclude<AppPathnames, '/blog/[slug]'>;

const LandingFooter = () => {
  const t = useTranslations('menu');

  const policyLinks = [
    { name: t('legal'), href: '/policy' as NavPathname },
    { name: t('cookies'), href: '/cookies' as NavPathname },
    { name: t('notice'), href: '/notice' as NavPathname },
    { name: t('ai_manifest'), href: '/ai-manifest' as NavPathname },
  ];

  return (
    <footer className="footer landing-footer">
      <div className="wrapper">
        <div className="max-w-[88.875rem] mx-auto footer-mid">
          <img className="logo-footer" src={logoFooter.src ?? logoFooter} alt="Gigson Solutions" />
          <svg className="footer-icon" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.6493 29.6887L26.9042 10.2882L3.0549 34L0 30.7662L23.8493 7.05488L4.43488 3.42941L7.68698 0L29.8609 4.01718L34 26.2593L30.6493 29.6887Z" />
          </svg>
        </div>
        <div className="footer-policy max-w-[88.875rem] mx-auto">
          <span>Developed by Gigson Solutions © {new Date().getFullYear()}</span>
          <ul className="footer-policy-links">
            {policyLinks.map(({ name, href }, index) => (
              <li key={index}>
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

const HEADER_H = 80; // ~20px top/bottom padding + logo height (40px) + 1px border

export default function LandingLayout({ children }: Props) {
  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--gs-cream)',
          paddingInline: 'var(--gs-padding-inline)',
        }}
      >
        <div
          className="flex items-center"
          style={{
            height: HEADER_H,
            maxWidth: 'var(--max-width-xl)',
            marginInline: 'auto',
            borderBottom: '1px solid var(--gs-ink)',
          }}
        >
          <Link href="/" aria-label="Gigson Solutions — inicio">
            <Image
              src={logoImg as string}
              alt="Gigson Solutions"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>
      </header>
      <main style={{ paddingTop: HEADER_H }}>{children}</main>
      <LandingFooter />
      <CookieBanner />
    </>
  );
}
