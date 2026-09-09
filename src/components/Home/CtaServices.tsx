'use client';

import './CtaServices.css';

import { useTranslations } from 'next-intl';

import cono from '../../assets/Cono.svg';
import cubo from '../../assets/Cubo.svg';
import { Link } from '../../../i18n/navigation';

const conoSrc = typeof cono === 'string' ? cono : (cono as { src: string }).src;
const cuboSrc = typeof cubo === 'string' ? cubo : (cubo as { src: string }).src;

export const CtaServices = () => {
  const t = useTranslations('whyservices');

  return (
    <div className="wrapper">
      <div className="cta-why-gigson">
        <div className="cta-img-container-cube">
          <img className="cta-services-img-cube" src={cuboSrc} alt="" />
        </div>
        <div className="internal-cta-container">
          <div className="cta-button-container">
            <h2>{t('sth2')}</h2>
            <Link href="/contact" className="button-main cta-why-gigson-btn">
              {t('slink')}
            </Link>
          </div>
        </div>
        <div className="cta-img-container-tria">
          <img className="cta-services-img" src={conoSrc} alt="" />
        </div>
      </div>
    </div>
  );
};
