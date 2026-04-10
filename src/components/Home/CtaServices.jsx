import './CtaServices.css';

import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import cono from '../../assets/Cono.svg';
import cubo from '../../assets/Cubo.svg';

gsap.registerPlugin(useGSAP);

export const CtaServices = () => {
  const { t } = useTranslation();
  const { sth2, slink } = t('whyservices');
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.to('.cta-services-img-cube', {
      y: -14,
      rotation: 8,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to('.cta-services-img', {
      y: 14,
      rotation: -6,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <div className="wrapper" ref={containerRef}>
      <div className="cta-why-gigson">
        <div className="cta-img-container-cube">
          <img className="cta-services-img-cube" src={cubo} alt="" />
        </div>
        <div className="internal-cta-container">
          <div className="cta-button-container">
            <h2>
              <Trans i18nKey={sth2} />
            </h2>
            <Link to="/services" className="button-main cta-why-gigson-btn">
              <Trans i18nKey={slink} />
            </Link>
          </div>
        </div>
        <div className="cta-img-container-tria">
          <img className="cta-services-img" src={cono} alt="" />
        </div>
      </div>
    </div>
  );
};
