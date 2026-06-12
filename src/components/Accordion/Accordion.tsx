'use client';

import './Accordion.css';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Link } from '../../../i18n/navigation';
import { AccordionAnimation } from './AccordionAnimation';

type Props = {
  title: string;
  subTitle?: string;
  challenge: string;
  features: string[];
  solution: string;
  tools: string[];
  featuresTitle: string;
  solutionTitle: string;
  toolsTitle?: string;
  isOpen: boolean;
  onClick: () => void;
  classContainer: string;
};

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
}: Props) => {
  const t = useTranslations('casesctaacordion');
  const accordionRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    onClick();
    setTimeout(() => {
      accordionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <>
      <div ref={accordionRef} style={{ position: 'relative', top: '-6rem' }} />
      <div onClick={handleClick} className="accordion-container">
        <button className="accordion-btn">
          <span className="accordion-title">{title}</span>
          <AccordionAnimation accordionOpen={isOpen} />
        </button>
        <div className={`accordion-content ${isOpen ? 'accordion-show-content' : ''}`}>
          <div className="accordion-content-text">
            <div className="oadljkgvbadojgbaed">
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
                <p>{t('pcasesctaacordion')}</p>
                <Link href="/contact" className="button-main cases-why-gigson-btn">
                  {t('talk')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
