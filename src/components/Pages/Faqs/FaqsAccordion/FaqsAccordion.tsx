'use client';

import '../../../Accordion/Accordion.css';

import { Link } from '../../../../../i18n/navigation';
import { AccordionAnimation } from '../../../Accordion/AccordionAnimation';

type Props = {
  question?: string;
  answer?: string;
  isOpen: boolean;
  onClick: () => void;
  cta?: string;
  children?: React.ReactNode;
};

export const FaqsAccordion = ({ question, answer, isOpen, onClick, cta, children }: Props) => {
  if (!question) return null;

  return (
    <div className="accordion-container faqs-container">
      <button className="accordion-btn" onClick={onClick} aria-expanded={isOpen}>
        <span className="accordion-title faqs">{question}</span>
        <AccordionAnimation accordionOpen={isOpen} faqs="faqs" />
      </button>
      <div className={`accordion-content ${isOpen ? 'accordion-show-content' : ''}`}>
        <div className="accordion-content-text">
          {children || answer}
          {/* Gated on the CTA's own copy, not on being the last item. It used to
              be `isLast`, a positional test, so removing or reordering the final
              entry handed the button to whichever question landed last — and if
              that one carries no `cta`, the button still rendered, with an empty
              label. */}
          {cta && (
            <div className="faq-button-wrapper">
              <Link href="/contact" className="about-hero-btn button-main">
                {cta}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
