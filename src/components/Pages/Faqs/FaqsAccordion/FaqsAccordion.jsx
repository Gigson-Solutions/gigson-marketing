import { Link } from "react-router-dom";
import { AccordionAnimation } from "../../../Accordion/AccordionAnimation";

export const FaqsAccordion = ({ question, answer, isOpen, onClick, cta, isLast }) => {
   return (
      <>
         {question && (
            <div className="accordion-container faqs-container">
               <button className="accordion-btn" onClick={onClick}>
                  <span className="accordion-title faqs">{question}</span>
                  <AccordionAnimation accordionOpen={isOpen} faqs="faqs" />
               </button>
               <div className={`accordion-content ${isOpen && "accordion-show-content"}`}>
                  <div className="accordion-content-text">
                     {answer}
                     {isLast && (
                        <div className="faq-button-wrapper">
                           <Link to="/contact" className="about-hero-btn button-main">
                              {cta && cta}
                           </Link>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </>
   );
};
