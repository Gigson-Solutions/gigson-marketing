'use client';

import './ServiceFaq.css';

import { useState } from 'react';

import { AccordionAnimation } from '../../components/Accordion/AccordionAnimation';

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceFaqProps = {
  title?: string;
  faqs: FaqItem[];
};

export function ServiceFaq({ title, faqs }: ServiceFaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const handleClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="wrapper service-faq-section">
      {title && <h2 className="service-faq-title">{title}</h2>}
      <div className="service-faq-list">
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="accordion-container faqs-container">
            <button
              className="accordion-btn"
              onClick={() => handleClick(i)}
              aria-expanded={activeIndex === i}
            >
              <span className="accordion-title faqs">{question}</span>
              <AccordionAnimation accordionOpen={activeIndex === i} faqs="faqs" />
            </button>
            <div
              className={`accordion-content ${activeIndex === i ? 'accordion-show-content' : ''}`}
            >
              <div className="accordion-content-text">{answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
