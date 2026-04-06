import './Faqs.css';

import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import cono from '../../../assets/cone.svg';
import { SeoHelmet } from '../../../seo/seoHelmet';
import pentagono from '../../../assets/pentagon.svg';
import { FaqsAccordion } from './FaqsAccordion/FaqsAccordion';

const Faqs = () => {
  const { t } = useTranslation();
  const seo = t('pageSeo.faqs');
  const title = t('faqsH1');
  const faqsData = t('faqsDropdown');

  const [activeIndex, setActiveIndex] = useState();

  const handleItemClick = (index) =>
    setActiveIndex((prevIndex) => (prevIndex === index ? undefined : index));

  return (
    <section className="faqs-section">
      <SeoHelmet title={seo.title} description={seo.description} />
      <div className="wrapper">
        <div className="hero-faqs">
          <h1 className="hero-faqs-h1">
            <Trans i18nKey={title} components={{ span: <span /> }} />
          </h1>
          <div className="faqs-imgs">
            <img src={pentagono} alt="" />
            <img src={cono} alt="" />
          </div>
        </div>

        {faqsData.map(({ title, question, answer, cta }, i) => {
          const isLast = i === faqsData.length - 1;

          return (
            <div key={i} className="faqs-accordion">
              <h2 className="faqs-accordion-h2">{title}</h2>
              <FaqsAccordion
                i={i}
                question={question}
                answer={answer}
                isOpen={activeIndex === i}
                onClick={() => handleItemClick(i)}
                isLast={isLast}
                cta={cta}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faqs;
