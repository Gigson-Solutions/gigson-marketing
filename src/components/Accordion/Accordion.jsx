import './Accordion.css';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AccordionAnimation } from './AccordionAnimation';

export const Accordion = ({
  title,
  challenge,
  features,
  solution,
  tools,
  featuresTitle,
  solutionTitle,
  isOpen,
  onClick,
  classContainer,
}) => {
  const { t } = useTranslation();
  const { pcasesctaacordion, talk } = t('casesctaacordion');

  const accordionRef = useRef();

  function handleCLick(e) {
    onClick();
    const el = document.querySelector(`.${classContainer}`);
    setTimeout(() => {
      accordionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  return (
    <>
      <div ref={accordionRef} style={{ position: 'relative', top: '-6rem' }} />
      <div onClick={handleCLick} className="accordion-container">
        <button className="accordion-btn">
          <span className="accordion-title">{title}</span>
          <AccordionAnimation accordionOpen={isOpen} />
        </button>
        <div
          className={`accordion-content ${isOpen && 'accordion-show-content'}`}
        >
          <div className="accordion-content-text">
            <div className={'oadljkgvbadojgbaed'}>
              <p className="cases-dropdown-challenge">{challenge}</p>
              <div className="cases-dropdown-features">
                <h4>{featuresTitle}</h4>
                <ul>
                  {features.map((feature, i) => (
                    <div key={i}>
                      <span />
                      <li>{feature}</li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
            <div className="cases-dropdown-solution">
              <div>
                <h4>{solutionTitle}</h4>
                <p>{solution}</p>
              </div>
              <ul className="cases-dropdown-tools">
                {tools.map((tool, i) => (
                  <div key={i}>
                    <span />
                    <li>{tool}</li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="cases-cta-acordion">
              <div className="div-cta">
                <p>{pcasesctaacordion}</p>
                <Link
                  to="/contact"
                  className="button-main cases-why-gigson-btn"
                >
                  {talk}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
