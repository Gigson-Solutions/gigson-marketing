import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import heroImg from '../../assets/HeroServices.png';

import './Services.css';

const Services = () => {
  const { t } = useTranslation();
  const { serviceH1, serviceP } = t('service');
  const servicesData = t('serviceCard');
  const { whyTitle, whyDescription } = t('whyChooseService');
  const { talk } = t('ctas');

  return (
    <div className="wrapper">
      <div className="services">
        <img src={heroImg} alt="" className="hero-services-img" />
        <section className="hero-services">
          <p className="hero-services-p">{serviceP}</p>
          <h1 className="hero-services-h1">
            <Trans i18nKey={serviceH1} components={{ span: <span /> }} />
          </h1>
        </section>
        <section className="services-container">
          {servicesData.map(({ title, description, cards }, i) => (
            <div key={i} className={`services-cards services-card-${i}`}>
              <header className="services-cards-top">
                <h2>{title}</h2>
                <p>{description}</p>
              </header>

              <footer className="service-footer">
                {cards.map(({ title, description }, index) => (
                  <div key={index} className="services-card-bottom">
                    <div>
                      <span className="services-cards-span">0{index + 1}</span>
                      <h3 className="services-cards-h3">{title}</h3>
                    </div>
                    <p className="services-cards-p">{description}</p>
                  </div>
                ))}
              </footer>
            </div>
          ))}
        </section>

        <section className="why-gigson">
          <h2>{whyTitle}</h2>
          <div>
            <p>{whyDescription}</p>
            <Link to="/contact" className="button-main why-gigson-btn">
              {talk}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
