import '../../Home/HomeServices.css';
import './NotFound.css';

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import bg from '../../../assets/mesh-gradient-2.png';
import { genArray } from '../../../hooks/genArray';

const NotFound = () => {
  const { t } = useTranslation();
  const { banner404, title, title2, description, cta } = t('notFound');

  return (
    <div className="div">
      <section className="not-home-services" id="homeServices">
        <div className="home-services-bg not_home-services-bg">
          <img src={bg} alt="" />
        </div>
        <div className="wrapper">
          <section className="not-div-about-hero">
            <h2 className="not-h1" id>
              <Trans i18nKey={title} components={{ span: <span /> }} />
            </h2>
            <h3 className="not-h3">
              <Trans i18nKey={title2} />
            </h3>
            <p className="not-p">{description}</p>

            <Link to="/" className="not-hero-btn button-main">
              {cta}
            </Link>
          </section>
        </div>
        <div className="home-text-container  not_home-text-container">
          <div className="services-h2-animation">
            <h2 className="not-home-services-h2">
              {genArray(20).map((v, k) => (
                <>
                  <Trans i18nKey={banner404} components={{ span: <span /> }} />
                  {' . '}
                </>
              ))}
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
