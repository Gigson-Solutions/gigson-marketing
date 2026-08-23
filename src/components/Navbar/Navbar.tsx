'use client';

import './NavbarHeader.css';

import { useTranslations } from 'next-intl';

import logoImg from '../../assets/Logo.svg';
import { Link } from '../../../i18n/navigation';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

const Navbar = () => {
  const t = useTranslations('menu');

  const menuLinks = [
    {
      name: t('services'),
      href: '/services' as const,
      children: [
        { name: t('CTO'), href: '/cto-as-service' as const },
        { name: t('tech_consulting'), href: '/technology-consulting' as const },
        { name: t('ai_agents'), href: '/ai-agents' as const },
        { name: t('software'), href: '/software-engineering' as const },
        { name: t('compliance'), href: '/iso-27001-certification' as const },
      ],
    },
    {
      name: t('industries'),
      children: [
        { name: t('logistics'), href: '/logistics-technology' as const },
        { name: t('retail'), href: '/retail-ecommerce-technology' as const },
        { name: t('construction'), href: '/construction-technology' as const },
        { name: t('professional_services'), href: '/professional-services-technology' as const },
      ],
    },
    {
      name: t('erp_solutions'),
      children: [
        { name: t('erp_odoo'), href: '/integrations-odoo' as const },
        { name: t('erp_custom'), href: '/custom-erp' as const },
        { name: t('erp_holded'), href: '/integrations-holded' as const },
      ],
    },
    { name: t('claude_partner'), href: '/about-claude-partner' as const },
    { name: t('cases'), href: '/cases' as const },
    { name: t('blog'), href: '/blog' as const },
    { name: t('about'), href: '/about' as const },
    { name: t('faqs'), href: '/faqs' as const },
    { name: t('contact'), href: '/contact' as const },
  ];

  return (
    <header className="header">
      <div className="div-header">
        <Link href="/">
          <img
            className="logo-header"
            src={logoImg.src ?? logoImg}
            alt="Logo Gigson Solutions"
          />
        </Link>
        <NavbarDesktop menu={menuLinks} />
        <NavbarMobile menu={menuLinks} />
      </div>
    </header>
  );
};

export default Navbar;
