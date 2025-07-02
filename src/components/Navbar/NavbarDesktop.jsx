import { NavLink } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector.jsx";


import "./NavbarDesktop.css";
import { getLocalizedPath } from "../../shared/utils/getLocalizedPath.js";

const ChevronDown = () => {
    return (
        <svg className="menu-item--chevron-down ml-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#3C3C3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    )
}


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
                                <NavLink className="menu-item__link" to={link} end>
                                    {name}
                                </NavLink>
                            ) : (
                                <>
                                    <span className="menu-item__link">
                                        {name}
                                        <ChevronDown />
                                    </span>
                                    <ul
                                        className="dropdown">
                                        {children.map(({ link, name }, childIndex) => (
                                            <li className="menu-item__child" key={childIndex}>
                                                <NavLink
                                                    className="menu-item__child__link"
                                                    to={link}
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

export default NavbarDesktop;
