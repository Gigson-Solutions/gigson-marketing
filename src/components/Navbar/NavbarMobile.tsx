'use client';

import './NavbarMobile.css';

import { useEffect, useState } from 'react';

import logoImg from '../../assets/Logo.svg';
import type { AppPathnames } from '../../../i18n/routing';
import { Link } from '../../../i18n/navigation';

type NavPathname = Exclude<AppPathnames, '/blog/[slug]'>;
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const ChevronDown = () => (
  <svg
    className="menu-item--chevron-down ml-3"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#3C3C3B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type MenuItem = {
  name: string;
  href?: NavPathname;
  children?: MenuItem[];
};

const NavbarMobile = ({ menu }: { menu: MenuItem[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | undefined>();

  const toggleDropdown = (index: number) =>
    setActiveDropdown((prev) => (prev === index ? undefined : index));

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navbar-mobile hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}>
      <input
        id="menuToggle"
        type="checkbox"
        checked={isMobileMenuOpen}
        onChange={toggleMobileMenu}
      />
      <label className="menu-btn" htmlFor="menuToggle">
        <span />
      </label>

      <div className="menu-box--mobile">
        <Link className="pt-10" href="/" onClick={closeMobileMenu}>
          <img className="logo-header-hamburger" src={logoImg.src ?? logoImg} alt="Logo Gigson Solutions" />
        </Link>

        <div className="border-nav" />
        <ul className="menu-items">
          {menu.map(({ name, href, children }, index) => (
            <li
              key={index}
              className={`menu-item ${children ? 'has-dropdown' : ''}`}
              onClick={() => isMobileMenuOpen && toggleDropdown(index)}
            >
              {children ? (
                <>
                  <span className="flex items-center menu-item__link">
                    {name}
                    <ChevronDown />
                  </span>
                  <ul className={`dropdown ${activeDropdown === index ? 'visible' : ''}`}>
                    {children.map(({ href: childHref, name: childName }, childIndex) => (
                      <li className="menu-item__child" key={childIndex}>
                        <Link
                          href={childHref ?? '/'}
                          className="menu-item__child__link"
                          onClick={closeMobileMenu}
                        >
                          {childName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={href ?? '/'} className="menu-item__link" onClick={closeMobileMenu}>
                  {name}
                </Link>
              )}
            </li>
          ))}
          <li className="flex items-center xl:ml-6">
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarMobile;
