import { Link } from 'react-router-dom';

import { AccordionAnimation } from '../../../Accordion/AccordionAnimation';

export const FaqsAccordion = ({ question, answer, isOpen, onClick, cta, isLast, children }) => {
   if (!question) return null;

   return (
       <div className="accordion-container faqs-container">
          <button
              className="accordion-btn"
              onClick={onClick}
              aria-expanded={isOpen}
          >
             <span className="accordion-title faqs">{question}</span>
             <AccordionAnimation accordionOpen={isOpen} faqs="faqs" />
          </button>
          <div className={`accordion-content ${isOpen ? 'accordion-show-content' : ''}`}>
             <div className="accordion-content-text">
                {children || answer}
                {isLast && (
                    <div className="faq-button-wrapper">
                       <Link to="/contact" className="about-hero-btn button-main">
                          {cta}
                       </Link>
                    </div>
                )}
             </div>
          </div>
       </div>
   );
};
