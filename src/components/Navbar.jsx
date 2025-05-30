import React, { useState } from 'react';
import './Navbar.css';
import logoImg from '../assets/Gigson-logo.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className='header'>
      <img className='logo-header' src={logoImg} alt="Logo"/>
      <nav className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <input id="menu__toggle" type="checkbox" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
        <label className="menu__btn" htmlFor="menu__toggle">
          <span></span>
        </label>
        <ul className="menu__box">
          <li><Link className="menu__item" to='/' onClick={closeMobileMenu}>SERVICES</Link></li>
          <li><Link className="menu__item" to='/' onClick={closeMobileMenu}>CASES</Link></li>
          <li><Link className="menu__item" to='/about' onClick={closeMobileMenu}>ABOUT US</Link></li>
          <li><Link className="menu__item" to='/' onClick={closeMobileMenu}>FAQs</Link></li>
          <li><Link className="menu__item" to='/' onClick={closeMobileMenu}>CONTACT</Link></li>
          <li><Link className="menu__item" to='/' onClick={closeMobileMenu}>EN / ES</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
