import { NavLink } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";

import chevronDownIcon from "../../assets/chevron-down-purple-accent.svg";

import "./NavbarDesktop.css";


const NavbarDesktop = ({ menu }) => {


    return (
        <nav className="navbar-desktop">

            <div className="menu-box--desktop">

                <ul className="menu-items">
                    {menu.map(({ name, link, children }, index) => (
                        <li
                            key={index}
                            className={`menu-item ${children ? "has-dropdown" : ""}`}
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
                                            <img src={chevronDownIcon} alt="chevron" className="ml-4" />
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

export default NavbarDesktop;
