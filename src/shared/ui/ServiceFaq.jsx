import { useState } from 'react';

import { AccordionAnimation } from '../../components/Accordion/AccordionAnimation';
import { FAQPageSchema } from '../../seo/SchemaOrg';

export function ServiceFaq({ title, faqs }) {
  const [activeIndex, setActiveIndex] = useState();

  const handleClick = (index) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  if (!faqs || faqs.length === 0) return;

  return (
    <section className="wrapper service-faq-section">
      <FAQPageSchema faqs={faqs} />
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
              <AccordionAnimation
                accordionOpen={activeIndex === i}
                faqs="faqs"
              />
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
