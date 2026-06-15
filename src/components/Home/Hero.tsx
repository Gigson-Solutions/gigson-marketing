'use client';

import './Hero.css';
import '../Button.css';

import { useTranslations } from 'next-intl';

import { Link } from '../../../i18n/navigation';
import { RichText } from '../../shared/ui/RichText';
import HeroScene from './HeroScene';

function Hero() {
  const t = useTranslations('home');

  return (
    <div className="wrapper">
      <section className="hero-section">
        <HeroScene className="hero-scene-overlay" />
        <header className="hero-top-content">
          <div className="hero-text">
            <p className="hero-p">{t('heroP')}</p>
            <RichText as="h1" content={t.raw('heroH1') as string} className="hero-h1" />
            <Link href="/contact" className="hero-btn button-main">
              {t('heroBtn')}
            </Link>
          </div>
        </header>
        <footer className="hero-godown">
          <div
            onClick={() => {
              const el = document.querySelector('#homeServices');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p className="hero-godown-a">{t('heroScroll')}</p>
            <svg className="icon-godown" viewBox="0 0 19 8" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1" stroke="#7874f4" />
            </svg>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default Hero;
