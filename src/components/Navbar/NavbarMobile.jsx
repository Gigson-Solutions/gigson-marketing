import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logoImg from "../../assets/Logo.svg";
import mesh from "../../assets/mesh-gradient.svg";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";

import "./NavbarMobile.css";


const NavbarMobile = ({ menu }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={`navbar-mobile hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <input id="menuToggle" type="checkbox" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
            <label className="menu-btn" htmlFor="menuToggle">
                <span></span>
            </label>

            <div className="menu-box--mobile">
                <Link to="/" onClick={closeMobileMenu}>
                    <img className="logo-header-hamburger" src={logoImg} alt="Logo Gigson Solutions" />
                </Link>

                <img className="mesh" src={mesh} alt="" />

                <div className="border-nav"></div>
                <ul className="menu-items">
                    {menu.map(({ name, link, children }, index) => (
                        <li
                            key={index}
                            className={`menu-item ${children ? "has-dropdown" : ""}`}
                            onMouseEnter={() => !isMobileMenuOpen && setActiveDropdown(index)}
                            onMouseLeave={() => !isMobileMenuOpen && setActiveDropdown(null)}
                            onClick={() => {
                                isMobileMenuOpen && toggleDropdown(index)
                            }}
                        >
                            <NavLink
                                to={link || "#"}
                                onClick={() => {
                                    // if (children) toggleDropdown(index);
                                    // else closeMobileMenu();
                                    closeMobileMenu();
                                }}
                            >
                                {name}
                            </NavLink>
                            {children && (
                                <ul
                                    className={`dropdown ${
                                        activeDropdown === index ? "visible" : ""
                                    }`}
                                >
                                    {children.map((child, childIndex) => (
                                        <li key={childIndex}>
                                            <NavLink
                                                to={child.link}
                                                // onClick={closeMobileMenu}
                                            >
                                                {child.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
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
