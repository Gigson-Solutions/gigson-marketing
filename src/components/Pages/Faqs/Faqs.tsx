'use client';

import './Faqs.css';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import cono from '../../../assets/cone.svg';
import pentagono from '../../../assets/pentagon.svg';
import { RichText } from '../../../shared/ui/RichText';
import { FaqsAccordion } from './FaqsAccordion/FaqsAccordion';

type FaqItem = { title?: string; question: string; answer: string; cta?: string };

const Faqs = () => {
  const t = useTranslations();
  const title = t('faqsH1');
  const faqsData = t.raw('faqsDropdown') as FaqItem[];

  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const handleItemClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  const conoSrc = typeof cono === 'string' ? cono : (cono as { src: string }).src;
  const pentagonoSrc = typeof pentagono === 'string' ? pentagono : (pentagono as { src: string }).src;

  return (
    <section className="faqs-section">
      <div className="wrapper">
        <div className="hero-faqs">
          <RichText as="h1" content={title} className="hero-faqs-h1" />
          <div className="faqs-imgs">
            <img src={pentagonoSrc} alt="" />
            <img src={conoSrc} alt="" />
          </div>
        </div>

        {faqsData.map(({ title: groupTitle, question, answer, cta }, i) => (
          <div key={i} className="faqs-accordion">
            {groupTitle && <h2 className="faqs-accordion-h2">{groupTitle}</h2>}
            <FaqsAccordion
              question={question}
              answer={answer}
              isOpen={activeIndex === i}
              onClick={() => handleItemClick(i)}
              isLast={i === faqsData.length - 1}
              cta={cta}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
