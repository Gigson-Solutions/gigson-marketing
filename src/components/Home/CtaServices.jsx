import './CtaServices.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import cono from '../../assets/Cono.svg';
import cubo from '../../assets/Cubo.svg';

export const CtaServices = () => {
  const { t } = useTranslation();
  const { sth2, slink } = t('whyservices');

  return (
    <div className="wrapper">
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
