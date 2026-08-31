'use client';

import './NavbarDesktop.css';

import type { AppPathnames } from '../../../i18n/routing';
import { Link, usePathname } from '../../../i18n/navigation';

type NavPathname = Exclude<AppPathnames, '/blog/[slug]'>;
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const ChevronDown = () => (
  <svg
    className="menu-item--chevron-down ml-3"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#3C3C3B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type MenuItem = {
  name: string;
  href?: NavPathname;
  children?: MenuItem[];
  columns?: { title: string; items: MenuItem[] }[];
};

const NavbarDesktop = ({ menu }: { menu: MenuItem[] }) => {
  const pathname = usePathname();

  return (
    <nav className="navbar-desktop">
      <div className="menu-box--desktop">
        <ul className="menu-items">
          {menu.map(({ name, href, children, columns }, index) => {
            const hasDropdown = Boolean(children || columns);
            const isActive = href ? pathname === href || pathname.startsWith(href + '/') : false;
            return (
              <li key={index} className={`menu-item ${hasDropdown ? 'has-dropdown' : ''}`}>
                {hasDropdown ? (
                  <>
                    {href ? (
                      <Link
                        href={href}
                        className={`menu-item__link${isActive ? ' active' : ''}`}
                      >
                        {name}
                        <ChevronDown />
                      </Link>
                    ) : (
                      <span className="menu-item__link">
                        {name}
                        <ChevronDown />
                      </span>
                    )}
                    {columns ? (
                      <div className="dropdown dropdown--columns">
                        {columns.map(({ title, items }, colIndex) => (
                          <div className="dropdown-column" key={colIndex}>
                            <span className="dropdown-column__title">{title}</span>
                            <ul className="dropdown-column__items">
                              {items.map(({ href: childHref, name: childName }, childIndex) => (
                                <li className="menu-item__child" key={childIndex}>
                                  <Link
                                    href={childHref ?? '/'}
                                    className="menu-item__child__link"
                                  >
                                    {childName}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="dropdown">
                        {children!.map(({ href: childHref, name: childName }, childIndex) => (
                          <li className="menu-item__child" key={childIndex}>
                            <Link
                              href={childHref ?? '/'}
                              className="menu-item__child__link"
                            >
                              {childName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={href ?? '/'}
                    className={`menu-item__link${isActive ? ' active' : ''}`}
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
          <li className="flex items-center xl:ml-6">
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarDesktop;
