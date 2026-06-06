import './AboutHero.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { SeoHelmet } from '../../seo/seoHelmet';
import circSvg from '../../assets/circunferencia1.svg';
import cubeSvg from '../../assets/cubo1.svg';
import piraSvg from '../../assets/tri1.svg';
// import WorldMap from './WorldMap';

const AboutHero = () => {
  const { t } = useTranslation();
  const { title, description, cta, titleH2, belive, need } = t('about');
  const seo = t('pageSeo.about');
  const { t1, t2, t3, t4, p1, p2, p3, p4 } = belive;
  const { label, cta2 } = need;

  const dataBelive = [
    { img: cubeSvg, title: t1, description: p1 },
    { img: piraSvg, title: t2, description: p2 },
    { img: circSvg, title: t3, description: p3 },
    { img: circSvg, title: t4, description: p4 },
  ];

  return (
    <>
      <SeoHelmet title={seo.title} description={seo.description} />
      <section className="div-about-hero">
        <div className="about-bg" />
        <div className="text-center">
          <h1 className="about-hero-h1">
            <Trans i18nKey={title} components={{ span: <span /> }} />
          </h1>
          <p className="about-hero-p mb-8">{description}</p>

          <Link to="/contact" className="about-hero-btn button-main">
            {cta}
          </Link>
        </div>
      </section>
      <div className="div-button-about-svg">
        <svg
          onClick={() => {
            const el = document
              .querySelector('.about-bellow')
              .scrollIntoView({ behavior: 'smooth' });
          }}
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

      <div
        className="about-bellow"
        style={{ top: '-6rem', position: 'relative' }}
      />
      <div className="about-belive-max">
        <div className="wrapper">
          <h2 className="about-hero-h2">{titleH2}</h2>
          <section className="div-about-belive">
            {dataBelive.map(({ img, title, description }, i) => (
              <article key={i}>
                <div className="div-svg-about">
                  <img src={img} alt={title} />
                </div>
                <span className="about-span">0{i + 1}</span>

                <h3 className="about-h3">{title}</h3>
                <p className="about-believe-p">{description}</p>
              </article>
            ))}
          </section>
        </div>
      </div>
      <div className="wrapper" style={{ overflowX: 'hidden' }}>
        <section className="about-section-need">
          <h2 className="about-hero-need-h2">
            <Trans i18nKey={need.t} components={{ span: <span /> }} />
          </h2>
          <p className="about-need-p">{need.d}</p>
        </section>
      </div>

      {/* <WorldMap /> */}

      <div className="wrapper">
        <div className="about-map-footer">
          <p className="about-believe-p">{label}</p>
          <Link to="/contact" className="about-button-contact button-main">
            {cta2}
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutHero;
