'use client';

import './AboutHero.css';

import { useTranslations } from 'next-intl';

import circSvg from '../../assets/circunferencia1.svg';
import cubeSvg from '../../assets/cubo1.svg';
import triaSvg from '../../assets/Trianguloycirculo.png';
import piraSvg from '../../assets/tri1.svg';
import { Link } from '../../../i18n/navigation';
import { RichText } from '../../shared/ui/RichText';
import WorldMap from './WorldMap';

const getImgSrc = (img: { src: string } | string) => (typeof img === 'string' ? img : img.src);

const AboutHero = () => {
  const t = useTranslations('about');
  const seo = useTranslations('pageSeo').raw('about') as { title: string; description: string };

  const title = t.raw('title') as string;
  const description = t('description');
  const cta = t('cta');
  const titleH2 = t('titleH2');
  const belive = t.raw('belive') as { t1: string; t2: string; t3: string; t4?: string; p1: string; p2: string; p3: string; p4?: string };
  const need = t.raw('need') as { t: string; d: string; cta2: string };

  const dataBelive = [
    { img: getImgSrc(cubeSvg as { src: string } | string), title: belive.t1, description: belive.p1 },
    { img: getImgSrc(piraSvg as { src: string } | string), title: belive.t2, description: belive.p2 },
    { img: getImgSrc(circSvg as { src: string } | string), title: belive.t3, description: belive.p3 },
    ...(belive.t4 ? [{ img: getImgSrc(circSvg as { src: string } | string), title: belive.t4, description: belive.p4 ?? '' }] : []),
  ];

  return (
    <>
      <section className="div-about-hero">
        <div className="about-bg" />
        <div className="text-center">
          <RichText as="h1" content={title} className="about-hero-h1" />
          <p className="about-hero-p mb-8">{description}</p>
          <Link href="/contact" className="about-hero-btn button-main">
            {cta}
          </Link>
        </div>
      </section>

      <div className="div-button-about-svg">
        <svg
          onClick={() => { document.querySelector('.about-bellow')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="icon-godown"
          viewBox="0 0 19 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1" stroke="#7874f4" />
        </svg>
      </div>

      <div className="about-bellow" style={{ top: '-6rem', position: 'relative' }} />

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
          <RichText as="h2" content={need.t} className="about-hero-need-h2" />
          <p className="about-need-p">{need.d}</p>
        </section>
      </div>

      <WorldMap />

      <div className="wrapper">
        <div className="about-map-footer">
          <Link href="/contact" className="about-button-contact button-main">
            {need.cta2}
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutHero;
