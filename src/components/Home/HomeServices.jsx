import './HomeServices.css';

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import homeServicesImg from '../../assets/FormasServices.png';
import { genArray } from '../../hooks/genArray';

function HomeServices() {
  const { t } = useTranslation();
  const { servicesTitle, servicesP, servicesBtn } = t('home');

  return (
    <section className="home-services" id="homeServices">
      <div className="home-services-bg" />

      <div className="home-text-container">
        <div className="services-h2-animation">
          <h2 className="home-services-h2">
            {genArray(4).map((v, k) => (
              <>
                <Trans
                  key={k}
                  i18nKey={servicesTitle}
                  components={{ span: <span /> }}
                />{' '}
              </>
            ))}
          </h2>
        </div>
      </div>
      <div className="wrapper">
        <div className="home-services-info">
          <div className="imgCt">
            <img
              className="home-services-img"
              src={homeServicesImg}
              alt="Home Services"
            />
          </div>

          <div className="home-services-text">
            <p className="home-services-p">{servicesP.p1}</p>
            <p className="home-services-p">{servicesP.p2}</p>
            <Link to="/services" className="home-services-btn button-main">
              {servicesBtn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeServices;
