import { useState } from "react";
import logoImg from "../../assets/Logo.svg";
import { Link, NavLink } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";
import { useTranslation } from "react-i18next";
import "./Navbar.css";
import mesh from "../../assets/mesh-gradient.svg"
import mesh2 from "../../assets/mesh-gradient-7.webp"

const Navbar = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const { t } = useTranslation();

   const { about, services, cases, faqs, contact, news } = t("menu");

   const menuLinks = [
      { name: services, link: "services" },
      { name: news, link: "landing" },
      { name: cases, link: "cases" },
      { name: about, link: "about" },
      { name: faqs, link: "faqs" },
      { name: contact, link: "contact" },
   ];

   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

   const closeMobileMenu = () => setIsMobileMenuOpen(false);

   return (
      <header className="header">
         <div className="div-header">
            <Link to="/">
               <img className="logo-header" src={logoImg} alt="Logo Gigson Solutions" />
            </Link>
            <nav className={`hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}>
               <input id="menuToggle" type="checkbox" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
               <label className="menu-btn" htmlFor="menuToggle">
                  <span></span>
               </label>

               <div className="menu-box">
                  {/*  Mobile Hamburger */}
                  <Link to="/" onClick={closeMobileMenu}>
                     <img className="logo-header-hamburger" src={logoImg} alt="Logo Gigson Solutions" />
                  </Link>

                  <img className="mesh" src={mesh} alt="" />

                  <div className="border-nav"></div>
                  <ul>
                     {menuLinks.map(({ name, link }, index) => (
                        <li key={index}>
                           <NavLink className="menu-item" to={link} onClick={closeMobileMenu}>
                              {name}
                           </NavLink>
                        </li>
                     ))}
                     <li className="flex items-center xl:ml-6">
                        <LanguageSelector />
                     </li>
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   );
};

export default Navbar;
