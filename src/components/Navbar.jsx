import './Navbar.css';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import logoImg from '../assets/Gigson-logo.svg';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../router/routerSlugs';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const slugs = ROUTE_SLUGS[i18n.language] || ROUTE_SLUGS[DEFAULT_LANG];
  const bookPath =
    i18n.language === DEFAULT_LANG
      ? `/${slugs.book}`
      : `/${i18n.language}/${slugs.book}`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <img className="logo-header" src={logoImg} alt="Logo" />
      <nav className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <input
          id="menu__toggle"
          type="checkbox"
          checked={isMobileMenuOpen}
          onChange={toggleMobileMenu}
        />
        <label className="menu__btn" htmlFor="menu__toggle">
          <span />
        </label>
        <ul className="menu__box">
          <li>
            <Link className="menu__item" to="/" onClick={closeMobileMenu}>
              SERVICES
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/" onClick={closeMobileMenu}>
              CASES
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/about" onClick={closeMobileMenu}>
              ABOUT US
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/" onClick={closeMobileMenu}>
              FAQs
            </Link>
          </li>
          <li>
            <Link
              className="menu__item"
              to={bookPath}
              onClick={closeMobileMenu}
            >
              BOOK
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/" onClick={closeMobileMenu}>
              CONTACT
            </Link>
          </li>
          <li>
            <Link className="menu__item" to="/" onClick={closeMobileMenu}>
              EN / ES
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
