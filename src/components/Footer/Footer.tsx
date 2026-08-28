'use client';

import './Footer.css';

import { useTranslations } from 'next-intl';

import logoFooter from '../../assets/LogoFooter.svg';
import type { AppPathnames } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';

type NavPathname = Exclude<AppPathnames, '/blog/[slug]'>;
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const Footer = () => {
  const t = useTranslations('menu');

  const menuLinks = [
    { name: t('services'), href: '/services' as NavPathname },
    { name: t('claude_partner'), href: '/about-claude-partner' as NavPathname },
    { name: t('erp_odoo'), href: '/integrations-odoo' as NavPathname },
    { name: t('erp_custom'), href: '/custom-erp' as NavPathname },
    { name: t('erp_holded'), href: '/integrations-holded' as NavPathname },
    { name: t('cases'), href: '/cases' as NavPathname },
    { name: t('blog'), href: '/blog' as NavPathname },
    { name: t('about'), href: '/about' as NavPathname },
    { name: t('faqs'), href: '/faqs' as NavPathname },
    { name: t('book'), href: '/book' as NavPathname },
    { name: t('contact'), href: '/contact' as NavPathname },
  ];

  const policyLinks = [
    { name: t('legal'), href: '/policy' as NavPathname },
    { name: t('cookies'), href: '/cookies' as NavPathname },
    { name: t('notice'), href: '/notice' as NavPathname },
    { name: t('ai_manifest'), href: '/ai-manifest' as NavPathname },
  ];

  return (
    <footer className="footer">
      <div className="wrapper">
        <nav className="footer-nav-container">
          <ul className="footer-nav-links">
            {menuLinks.map(({ name, href }, index) => (
              <li key={index}>
                <Link href={href}>{name}</Link>
              </li>
            ))}
          </ul>
          <div className="language-selector-container">
            <LanguageSelector />
          </div>
        </nav>
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

export default Footer;
