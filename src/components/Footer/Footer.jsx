import logoFooter from '../../assets/LogoFooter.svg'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
    const menuLinks = [
        {name: 'ABOUT ',  link:'about'},
        {name: 'SERVICES',  link:'services'},
        {name: 'CASES',     link:'cases'},
        {name: 'FAQs',      link:'faqs'},
        {name: 'CONTACT US',   link:'contact'},
    ]

  return (
    <footer className='footer'>
        <div className="footer-maxwidth">
            <nav className="footer-nav-container">
                <ul className="footer-nav-links">
                    {menuLinks.map(({name, link}, index) => 
                        
                        <li key={index} >
                            <Link to={link}>{name}</Link>
                        </li>

                    )}
                        <li>
                            <Link className='language-link' to='error'>EN / <span className='spam-lng'>ES</span></Link>
                        </li>
                </ul>            
            </nav>
            <div className='footer-mid'>
                <img className='logo-footer' src={logoFooter}/>

                <svg className='footer-icon' viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.6493 29.6887L26.9042 10.2882L3.0549 34L0 30.7662L23.8493 7.05488L4.43488 3.42941L7.68698 0L29.8609 4.01718L34 26.2593L30.6493 29.6887Z"/>
                </svg>
            </div>
            
            <div className="footer-policy">
                <span href="">Developed by gigson © 2024 </span>
                <ul className='footer-policy-links'>
                    <li><a href="">Legal Policy</a></li>
                    <li><a href="">Cookies Policy</a></li>
                    <li><a href="">Legal Notice</a></li>
                        
                </ul>
            </div>
        </div>
    </footer>
  )
}

export default Footer