import logoImg from "../../assets/Logo.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./NavbarHeader.css";
import NavbarDesktop from "./NavbarDesktop.jsx";
import NavbarMobile from "./NavbarMobile.jsx";

const Navbar = () => {
   const { t } = useTranslation();

   const { about, services, cases, faqs, contact, news, logistics } = t("menu");

   const menuLinks = [
      { name: services, link: "services" },
      {
         name: cases,
         children: [
            { name: logistics, link: "/cases/tecnologia-logistica" }
         ],
      },
      { name: about, link: "about" },
      { name: faqs, link: "faqs" },
      { name: contact, link: "contact" },
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
