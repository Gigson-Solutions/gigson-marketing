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

  // Real services directory (replaces a single flat "Servicios" link that
  // pointed at a since-removed overview page — every service already has
  // its own dedicated page) organized the same way as the Navbar's
  // Servicios dropdown, split into the two engagement-type columns.
  const consultingLinks = [
    { name: t('CTO'), href: '/cto-as-service' as NavPathname },
    { name: t('tech_consulting'), href: '/technology-consulting' as NavPathname },
    { name: t('compliance'), href: '/iso-27001-certification' as NavPathname },
    { name: t('erp_odoo'), href: '/integrations-odoo' as NavPathname },
    { name: t('erp_holded'), href: '/integrations-holded' as NavPathname },
  ];

  const buildingLinks = [
    { name: t('ai_agents'), href: '/ai-agents' as NavPathname },
    { name: t('software'), href: '/software-engineering' as NavPathname },
    { name: t('erp_custom'), href: '/custom-erp' as NavPathname },
  ];

  // Everything else that used to sit alongside "Servicios" in one flat list.
  const generalLinks = [
    { name: t('estimator'), href: '/project-estimator' as NavPathname },
    { name: t('cases'), href: '/cases' as NavPathname },
    { name: t('blog'), href: '/blog' as NavPathname },
    { name: t('contact'), href: '/contact' as NavPathname },
    { name: t('claude_partner'), href: '/about-claude-partner' as NavPathname },
    { name: t('about'), href: '/about' as NavPathname },
    { name: t('faqs'), href: '/faqs' as NavPathname },
  ];

  const policyLinks = [
    { name: t('legal'), href: '/policy' as NavPathname },
    { name: t('cookies'), href: '/cookies' as NavPathname },
    { name: t('notice'), href: '/notice' as NavPathname },
    { name: t('ai_manifest'), href: '/ai-manifest' as NavPathname },
  ];

  const groups = [
    { label: t('consultingLabel'), links: consultingLinks },
    { label: t('buildingLabel'), links: buildingLinks },
    { label: null, links: generalLinks },
  ];

  return (
    <footer className="footer">
      <div className="wrapper">
        <nav className="footer-nav-container">
          <div className="footer-nav-groups">
            {groups.map((group, groupIndex) => (
              <div className="footer-nav-group" key={groupIndex}>
                {group.label && <span className="footer-nav-label">{group.label}</span>}
                <ul className="footer-nav-links">
                  {group.links.map(({ name, href }, index) => (
                    <li key={index}>
                      <Link href={href}>{name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
