import { useState } from "react";
import { NavLink } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";

import "./NavbarDesktop.css";


const NavbarDesktop = ({ menu }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };


    return (
        <nav className="navbar-desktop">

            <div className="menu-box--desktop">

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

export default NavbarDesktop;
