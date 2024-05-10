import { useState } from 'react';
import logoImg from '../../assets/Logo.svg';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuLinks = [
    {name: 'ABOUT ',  link:'about'},
    {name: 'SERVICES',  link:'services'},
    {name: 'CASES',     link:'cases'},
    {name: 'FAQs',      link:'faqs'},
    {name: 'CONTACT US',   link:'contact'},
  ]

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <header className='header'>
      <div className='div-header'>
        <Link to='/'>
          <img 
            className='logo-header' 
            src={logoImg} 
            alt="Logo Gigson Solutions"
          />
        </Link>
        <nav className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <input id="menuToggle" type="checkbox" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
          <label className="menu-btn" htmlFor="menuToggle">
            <span></span>
          </label>
          <ul className="menu-box">
            <Link to='/' onClick={closeMobileMenu}>
              <img 
                className='logo-header-hamburger' 
                src={logoImg} 
                alt="Logo Gigson Solutions"
              />
            </Link>
            {menuLinks.map(({name,link}, index) => 

                  <li key={index}>
                      <NavLink 
                        className="menu-item" 
                        to={link} 
                        onClick={closeMobileMenu}
                      >{name}</NavLink>
                  </li>

            )}            
                  <li>
                      <Link className="menu-item"  to='error' onClick={closeMobileMenu}>EN / <span className='spam-lng'>ES</span></Link>
                  </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;