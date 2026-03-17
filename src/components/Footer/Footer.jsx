import './Footer.css';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import logoFooter from '../../assets/LogoFooter.svg';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../../router/routerSlugs';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const slugs = ROUTE_SLUGS[i18n.language] || ROUTE_SLUGS[DEFAULT_LANG];
  const langPrefix = i18n.language === DEFAULT_LANG ? '' : `/${i18n.language}`;

  const { about, services, cases, faqs, book, contact, legal, cookies, notice } =
    t('menu');

  const menuLinks = [
    { name: services, link: `${langPrefix}/${slugs.services}`.replace('//', '/') },
    { name: cases, link: `${langPrefix}/${slugs.cases}`.replace('//', '/') },
    { name: about, link: `${langPrefix}/${slugs.about}`.replace('//', '/') },
    { name: faqs, link: `${langPrefix}/${slugs.faqs}`.replace('//', '/') },
    { name: book, link: `${langPrefix}/${slugs.book}`.replace('//', '/') },
    { name: contact, link: `${langPrefix}/${slugs.contact}`.replace('//', '/') },
  ];

  return (
    <footer className="footer">
      <div className="wrapper">
        <nav className="footer-nav-container">
          <ul className="footer-nav-links">
            {menuLinks.map(({ name, link }, index) => (
              <li key={index}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
          <div className="language-selector-container">
            <LanguageSelector />
          </div>
        </nav>
        <div className="max-w-[88.875rem] mx-auto footer-mid">
          <img className="logo-footer" src={logoFooter} />

          <svg
            className="footer-icon"
            viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M30.6493 29.6887L26.9042 10.2882L3.0549 34L0 30.7662L23.8493 7.05488L4.43488 3.42941L7.68698 0L29.8609 4.01718L34 26.2593L30.6493 29.6887Z" />
          </svg>
        </div>

        <div className="footer-policy max-w-[88.875rem] mx-auto">
          <span href="">Developed by Gigson Solutions © 2025 </span>
          <ul className="footer-policy-links">
            <li>
              <Link to="/policy">{legal}</Link>
            </li>
            <li>
              <Link to="/cookies">{cookies}</Link>
            </li>
            <li>
              <Link to="/notice">{notice}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
