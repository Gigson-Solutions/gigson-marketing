import {useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";

import logoImg from "../../assets/Logo.svg";
import mesh from "../../assets/mesh-gradient.svg";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";

import "./NavbarMobile.css";

const ChevronDown = () => {
    return (
        <svg className="menu-item--chevron-down ml-3" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#3C3C3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}


const NavbarMobile = ({ menu }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [isMobileMenuOpen]);

    return (
        <nav className={`navbar-mobile hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <input id="menuToggle" type="checkbox" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
            <label className="menu-btn" htmlFor="menuToggle">
                <span></span>
            </label>

            <div className="menu-box--mobile">
                <Link className="pt-10" to="/" onClick={closeMobileMenu}>
                    <img className="logo-header-hamburger" src={logoImg} alt="Logo Gigson Solutions" />
                </Link>

                <div className="border-nav"></div>
                <ul className="menu-items">
                    {menu.map(({ name, link, children }, index) => (
                        <li
                            key={index}
                            className={`menu-item ${children ? "has-dropdown" : ""}`}
                            onClick={() => {
                                isMobileMenuOpen && toggleDropdown(index)
                            }}
                        >
                            {!children ? (
                                <NavLink className="menu-item__link" to={link} onClick={closeMobileMenu}>
                                    {name}
                                </NavLink>
                            ) : (
                                <>
                                    <span className="flex items-center menu-item__link">
                                        {name}
                                        <ChevronDown />
                                    </span>
                                    <ul className={`dropdown ${activeDropdown === index ? "visible" : ""}`}>
                                        {children.map(({ link, name }, childIndex) => (
                                            <li className="menu-item__child" key={childIndex}>
                                                <NavLink
                                                    className="menu-item__child__link"
                                                    to={link}
                                                    onClick={closeMobileMenu}
                                                    end
                                                >
                                                    {name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </li>
                    ))}
                    <li className="flex items-center xl:ml-6">
                        <LanguageSelector />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavbarMobile;
