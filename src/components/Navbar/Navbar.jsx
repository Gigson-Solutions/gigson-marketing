import logoImg from "../../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./NavbarHeader.css";
import NavbarDesktop from "./NavbarDesktop.jsx";
import NavbarMobile from "./NavbarMobile.jsx";
import { ROUTE_SLUGS, DEFAULT_LANG, SUPPORTED_LANGS } from "../../router/routerSlugs.js";

const Navbar = () => {
   const { t } = useTranslation();
   const location = useLocation();

   const currentPath = location.pathname;
   const segments = currentPath.split("/").filter(Boolean);

   const currentLang = SUPPORTED_LANGS.includes(segments[0])
      ? segments[0]
      : DEFAULT_LANG;

   const { about, services, cases, faqs, contact, industries, logistics } = t("menu");

   const menuLinks = [
      { name: services, link: ROUTE_SLUGS[currentLang].services },
      { name: industries, children: [{ name: logistics, link: ROUTE_SLUGS[currentLang].logistics },] },
      { name: cases, link: ROUTE_SLUGS[currentLang].cases },
      { name: about, link: ROUTE_SLUGS[currentLang].about },
      { name: faqs, link: ROUTE_SLUGS[currentLang].faqs },
      { name: contact, link: ROUTE_SLUGS[currentLang].contact },
   ];

   return (
      <header className="header">
         <div className="div-header">
            <Link to="/">
               <img className="logo-header" src={logoImg} alt="Logo Gigson Solutions" />
            </Link>
            <NavbarDesktop menu={menuLinks} />
            <NavbarMobile menu={menuLinks} />
         </div>
      </header>
   );
};

export default Navbar;
