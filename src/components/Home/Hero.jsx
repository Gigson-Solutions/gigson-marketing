import './Hero.css';
import '../Button.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function Hero() {
  const { t } = useTranslation();
  const { heroH1, heroP, heroBtn, heroScroll } = t('home');

  const largeSphereRef = useRef(null);
  const smallSphereRef = useRef(null);

  useEffect(() => {
    function rotateSphere(el, delay) {
      const props = { lx: 32, ly: 28 };

      function nextRotation() {
        const targetLx = 15 + Math.random() * 55;
        const targetLy = 15 + Math.random() * 55;
        const duration = 8 + Math.random() * 7;

        gsap.to(props, {
          lx: targetLx,
          ly: targetLy,
          duration,
          ease: 'power1.inOut',
          onUpdate() {
            el.style.setProperty('--lx', props.lx.toFixed(1) + '%');
            el.style.setProperty('--ly', props.ly.toFixed(1) + '%');
          },
          onComplete: nextRotation,
        });
      }

      gsap.delayedCall(delay, nextRotation);
    }

    rotateSphere(largeSphereRef.current, 0);
    rotateSphere(smallSphereRef.current, 4);
  }, []);

  return (
    <div className="wrapper">
      <section className="hero-section">
        <header className="hero-top-content">
          <div className="hero-shapes" aria-hidden="true">
            <svg
              className="hero-pentagon"
              viewBox="0 0 163 172"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M60.9883 1.24196L0.826521 86.6989L63.4534 170.484L162.333 136.808L160.803 32.2151L60.9883 1.24196Z"
                stroke="#7874F4"
                strokeWidth="0.5"
                strokeMiterlimit="10"
              />
            </svg>
            <div className="hero-sphere hero-sphere--large" ref={largeSphereRef} />
            <div className="hero-sphere hero-sphere--small" ref={smallSphereRef} />
          </div>
          <div className="hero-text">
            <p className="hero-p">{heroP}</p>
            <h1 className="hero-h1">
              <Trans i18nKey={heroH1} components={{ span: <span /> }} />
            </h1>
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
