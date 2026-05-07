import './Services.css';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccordionAnimation } from '../Accordion/AccordionAnimation';
import { SeoHelmet } from '../../seo/seoHelmet';
import { ButtonLink } from '../../shared/ui/Button';

const Tag = ({ label }) => (
  <span className="text-smallTag text-dark-medium border border-dark-medium rounded-full px-3 py-1">
    {label}
  </span>
);

const ServiceAccordionItem = ({ number, title, tagline, sections, tags, cta }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-dark-primary">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-start justify-between gap-6 py-8 lg:py-10 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-baseline gap-4 lg:gap-8 min-w-0">
          <span className="text-body text-purple-accents font-mono shrink-0">{number}</span>
          <div className="min-w-0">
            <h2 className="text-h2 text-dark-primary">{title}</h2>
            {!isOpen && (
              <p className="text-body text-dark-medium mt-2 max-w-2xl">{tagline}</p>
            )}
          </div>
        </div>
        <AccordionAnimation accordionOpen={isOpen} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] pb-12' : 'max-h-0'
        }`}
      >
        <p className="text-subtitle text-dark-medium mb-10 max-w-2xl">{tagline}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-smallTag text-purple-accents uppercase tracking-widest mb-5">
                {section.heading}
              </h3>
              {section.numbered ? (
                <ol className="flex flex-col gap-4">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-body text-dark-medium flex gap-3">
                      <span className="text-purple-accents shrink-0 font-mono">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="flex flex-col gap-4">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-body text-dark-medium flex gap-3">
                      <span className="text-purple-accents shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.tags && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {section.tags.map((tag, k) => (
                    <Tag key={k} label={tag} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {tags && (
          <div className="flex flex-wrap gap-2 mt-8">
            {tags.map((tag, i) => (
              <Tag key={i} label={tag} />
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-10">
            <ButtonLink link={cta.link} text={cta.text} outlined />
          </div>
        )}
      </div>
    </div>
  );
};

const EngagementCard = ({ type, subtitle, description, items }) => (
  <div className="bg-purple-light-a rounded-2xl p-8 lg:p-10 flex flex-col gap-6">
    <div>
      <p className="text-smallTag text-purple-accents uppercase tracking-widest mb-2">{type}</p>
      <h3 className="text-h3 text-dark-primary">{subtitle}</h3>
    </div>
    <p className="text-body text-dark-medium">{description}</p>
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={i} className="text-body text-dark-medium flex gap-3">
          <span className="text-purple-accents shrink-0">—</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-dark-primary">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-4 py-6 text-left cursor-pointer"
      aria-expanded={isOpen}
    >
      <span className="text-h4 text-dark-primary">{question}</span>
      <AccordionAnimation accordionOpen={isOpen} faqs={true} />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
      }`}
    >
      <p className="text-body text-dark-medium">{answer}</p>
    </div>
  </div>
);

const Services = () => {
  const { t } = useTranslation();
  const seo = t('pageSeo.services');
  const page = t('servicesPage');

  const [activeFaq, setActiveFaq] = useState(null);
  const handleFaqClick = (i) =>
    setActiveFaq((prev) => (prev === i ? null : i));

  return (
    <>
      <SeoHelmet title={seo.title} description={seo.description} />

      {/* Hero */}
      <section className="px-landing mt-fixed-navbar pt-14 lg:pt-23 pb-16 lg:pb-20">
        <div className="max-w-[88.875rem] mx-auto">
          <p className="text-body text-purple-accents uppercase mb-4">{page.hero.suptitle}</p>
          <h1 className="text-h1 text-dark-primary max-w-3xl mb-4">{page.hero.title}</h1>
          <p className="text-subtitle text-dark-medium max-w-xl">{page.hero.description}</p>
        </div>
      </section>

      {/* Services accordions */}
      <section className="px-landing pb-20 lg:pb-32">
        <div className="max-w-[88.875rem] mx-auto">
          {page.services.map((service) => (
            <ServiceAccordionItem key={service.number} {...service} />
          ))}
          <div className="border-t border-dark-primary" />
        </div>
      </section>

      {/* Engagement models */}
      <section className="px-landing py-16 lg:py-24">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-10 lg:mb-14">{page.engagement.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {page.engagement.models.map((model, i) => (
              <EngagementCard key={i} {...model} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-landing py-16 lg:py-24">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-10 lg:mb-14">{page.faq.title}</h2>
          <div>
            {page.faq.items.map((item, i) => (
              <FaqItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={activeFaq === i}
                onClick={() => handleFaqClick(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-landing py-20 lg:py-32">
        <div className="max-w-[88.875rem] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-h2 text-dark-primary max-w-2xl">{page.cta.title}</h2>
          <ButtonLink link="/contact" text={page.cta.buttonText} />
        </div>
      </section>
    </>
  );
};

export default Services;
