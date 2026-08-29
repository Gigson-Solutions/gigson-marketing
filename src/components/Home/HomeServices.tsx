'use client';

import './HomeServices.css';

import { useTranslations } from 'next-intl';

import homeServicesImg from '../../assets/FormasServices.png';
import { genArray } from '../../hooks/genArray';
import { Link } from '../../../i18n/navigation';
import { RichText } from '../../shared/ui/RichText';

const imgSrc = typeof homeServicesImg === 'string' ? homeServicesImg : (homeServicesImg as { src: string }).src;

function HomeServices() {
  const t = useTranslations('home');
  const servicesP = t.raw('servicesP') as { p1: string; p2: string };

  return (
    <section className="home-services" id="homeServices">
      <div className="home-services-bg" />

      <div className="home-text-container">
        <div className="services-h2-animation">
          <h2 className="home-services-h2">
            {genArray(10).map((_, k) => (
              <span key={k}>
                <RichText as="span" content={t.raw('servicesTitle') as string} />{' '}
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="wrapper">
        <div className="home-services-info">
          <div className="imgCt">
            <img className="home-services-img" src={imgSrc} alt="Home Services" />
          </div>
          <div className="home-services-text">
            <p className="home-services-p">{servicesP.p1}</p>
            <p className="home-services-p">{servicesP.p2}</p>
            <Link href="/contact" className="home-services-btn button-main">
              {t('servicesBtn')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
