import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import logoImg from "../../assets/Logo.svg";
import mesh from "../../assets/mesh-gradient.svg";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";

import "./NavbarMobile.css";
import chevronDownPurpleIcon from "../../assets/chevron-down-purple-accent.svg";


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
                            onClick={() => {
                                isMobileMenuOpen && toggleDropdown(index)
                            }}
                        >
                            {!children ? (
                                <NavLink className="menu-item__link" to={link}>
                                    {name}
                                </NavLink>
                            ) : (
                                <>
                                    <span className="flex items-center menu-item__link">
                                        {name}
                                        <span>
                                            <img src={chevronDownPurpleIcon} alt="chevron" className="menu-item__link--chevron-purple ml-4" />
                                        </span>
                                    </span>
                                    <ul
                                        className="dropdown">
                                        {children.map((child, childIndex) => (
                                            <li className="menu-item__child" key={childIndex}>
                                                <NavLink
                                                    className="menu-item__child__link"
                                                    to={child.link}
                                                >
                                                    {child.name}
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
