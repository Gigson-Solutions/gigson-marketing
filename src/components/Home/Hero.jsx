import './Hero.css';
import '../Button.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import heroImg from '../../assets/Imagen-esfera-hexagono.png';

function Hero() {
  const { t } = useTranslation();
  const { heroH1, heroSubhead, heroBtn, heroScroll } = t('home');

  return (
    <div className="wrapper">
      <section className="hero-section">
        <header className="hero-top-content">
          <img className="hero-img" src={heroImg} alt="" />
          <div className="hero-text">
            <div className="hero-partner-badge">
              <img
                className="hero-anthropic-logo"
                src="/claude-logo.png"
                alt="Claude"
              />
              <span className="hero-badge-sep">·</span>
              <span className="hero-badge-label">CERTIFIED CLAUDE PARTNER</span>
            </div>
            <h1 className="hero-h1">
              <Trans i18nKey={heroH1} components={{ span: <span /> }} />
            </h1>
            <p className="hero-subhead">{heroSubhead}</p>
            <Link to="/contact" className="hero-btn button-main">
              {heroBtn}
            </Link>
          </div>
        </header>
        <footer className="hero-godown">
          <div
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector('#homeServices');
              el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p className="hero-godown-a">{heroScroll}</p>
            <svg
              className="icon-godown"
              viewBox="0 0 19 8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1"
                stroke="#7874f4"
              />
            </svg>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default Hero;
