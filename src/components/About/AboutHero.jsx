import './AboutHero.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import circSvg from '../../assets/circunferencia1.svg';
import cubeSvg from '../../assets/cubo1.svg';
import piraSvg from '../../assets/tri1.svg';
import triaSvg from '../../assets/Trianguloycirculo.png';

const AboutHero = () => {
  const { t } = useTranslation();
  const { title, description, cta, titleH2, belive, need } = t('about');
  const { t1, t2, t3, p1, p2, p3 } = belive;
  const {
    specialist1,
    specialist2,
    specialist3,
    specialist4,
    specialist5,
    specialist6,
    specialist7,
    specialist8,
    specialist9,
    label,
    cta2,
  } = need;

  const dataBelive = [
    { img: cubeSvg, title: t1, description: p1 },
    { img: piraSvg, title: t2, description: p2 },
    { img: circSvg, title: t3, description: p3 },
  ];

  const dataSpecialist = [
    { title: 'Product Manager', desc: specialist1 },
    { title: 'FullStack', desc: specialist2 },
    { title: 'Solution Architect', desc: specialist3 },
    { title: 'Backend Developer', desc: specialist4 },
    { title: 'Business Analyst', desc: specialist5 },
    { title: 'Frontend Developer', desc: specialist6 },
    { title: 'Quality Assurance', desc: specialist7 },
    { title: 'UX/UI Designer', desc: specialist8 },
    { title: 'Security Engineer', desc: specialist9 },
  ];

  return (
    <>
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
          <img
            className="about-background-image-DgPrd"
            src={triaSvg}
            alt="tria"
          />{' '}
          {}
          <h2 className="about-hero-need-h2">
            <Trans i18nKey={need.t} components={{ span: <span /> }} />
          </h2>
          <p className="about-need-p">{need.d}</p>
          <div className="about-div-specialist">
            {dataSpecialist.map(({ title, desc }, i) => (
              <div key={i}>
                <h3 className="about-need-h3">{title}</h3>
                <p className="about-need-p1">{desc}</p>
              </div>
            ))}
          </div>
          <p className="about-believe-p" style={{ marginBottom: 0 }}>
            {label}
          </p>
          <div className="about-button-container">
            <Link to="/contact" className="about-button-contact button-main">
              {cta2}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutHero;
