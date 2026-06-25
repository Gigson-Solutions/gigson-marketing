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
  features?: string[];
  solution?: string;
  tools?: string[];
  featuresTitle?: string;
  solutionTitle?: string;
  toolsTitle?: string;
  isOpen: boolean;
  onClick: () => void;
  classContainer: string;
  ctaHref?: string;
  ctaLabel?: string;
  hideCTADescription?: boolean;
  inlineCTA?: boolean;
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
  ctaHref,
  ctaLabel,
  hideCTADescription = false,
  inlineCTA = false,
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
            <div
              className="oadljkgvbadojgbaed"
              style={inlineCTA ? { borderBottom: 'none' } : undefined}
            >
              <p className="cases-dropdown-challenge">{challenge}</p>

              {inlineCTA ? (
                /* CTA inline — right of the description text, no gray box */
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {ctaHref ? (
                    <a
                      href={ctaHref}
                      className="button-main cases-why-gigson-btn"
                      style={{ marginTop: 0 }}
                      onClick={e => e.stopPropagation()}
                    >
                      {ctaLabel ?? t('talk')}
                    </a>
                  ) : (
                    <Link
                      href="/contact"
                      className="button-main cases-why-gigson-btn"
                      style={{ marginTop: 0 }}
                      onClick={e => e.stopPropagation()}
                    >
                      {ctaLabel ?? t('talk')}
                    </Link>
                  )}
                </div>
              ) : (
                features && features.length > 0 && featuresTitle && (
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
                )
              )}
            </div>

            {!inlineCTA && solution && solutionTitle && (
              <div className="cases-dropdown-solution">
                <div>
                  <h4>{solutionTitle}</h4>
                  <p>{solution}</p>
                </div>
                {tools && tools.length > 0 && (
                  <ul className="cases-dropdown-tools">
                    {tools.map((tool, i) => (
                      <div key={i}>
                        <span />
                        <li>{tool}</li>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!inlineCTA && (
              <div className="cases-cta-acordion">
                <div className="div-cta">
                  {!hideCTADescription && <p>{t('pcasesctaacordion')}</p>}
                  {ctaHref ? (
                    <a href={ctaHref} className="button-main cases-why-gigson-btn">
                      {ctaLabel ?? t('talk')}
                    </a>
                  ) : (
                    <Link href="/contact" className="button-main cases-why-gigson-btn">
                      {ctaLabel ?? t('talk')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
