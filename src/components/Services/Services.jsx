import './Services.css';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBreakpoint } from 'shared/hooks/useBreakpoint.jsx';

import {
  DEFAULT_LANG,
  ROUTE_SLUGS,
  SUPPORTED_LANGS,
} from '../../router/routerSlugs';
import { SeoHelmet } from '../../seo/seoHelmet';
import { ButtonLink } from '../../shared/ui/Button';
import { AccordionAnimation } from '../Accordion/AccordionAnimation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─── Off Menu flip card ──────────────────────────────────────── */

const ClaudeBadge = () => (
  <div className="flex items-center gap-[0.625rem] shrink-0">
    <img src="/claude-logo.png" alt="Claude" className="h-5 w-auto block" />
    <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-purple-accents">
      Certified Claude Partner
    </span>
  </div>
);

const OffMenuCard = ({
  label,
  title,
  price,
  tagline,
  isDark,
  ctaText,
  sections,
  badge,
  link,
}) => {
  const cardInnerRef = useRef(null);
  const { isDesktop } = useBreakpoint();
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  const flipTo = (toBack) => {
    if (flipped === toBack) return;
    setFlipped(toBack);
    gsap.to(cardInnerRef.current, {
      rotationY: toBack ? 180 : 0,
      duration: 0.65,
      ease: 'power3.inOut',
    });
  };

  const handleClick = () => {
    if (link) {
      navigate(link);
    } else if (!isDesktop) {
      flipTo(!flipped);
    }
  };

  const bg = isDark ? '#3C3C3B' : '#EDECE8';
  const labelCls = isDark ? 'text-white/50' : 'text-dark-medium';
  const titleCls = isDark ? 'text-white' : 'text-dark-primary';
  const taglineCls = isDark ? 'text-white/40' : 'text-dark-medium';
  const bodyBackCls = isDark ? 'text-white/75' : 'text-dark-medium';
  const btnCls = isDark
    ? 'bg-white text-[#3C3C3B] hover:opacity-75'
    : 'bg-[#3C3C3B] text-white hover:opacity-75';

  return (
    <div
      data-anim-card
      className="h-[480px] lg:h-[520px] cursor-pointer"
      style={{ perspective: '1200px' }}
      onMouseEnter={isDesktop ? () => flipTo(true) : undefined}
      onMouseLeave={isDesktop ? () => flipTo(false) : undefined}
      onClick={handleClick}
    >
      <div ref={cardInnerRef} className="flip-card-inner h-full">
        {/* ── Front ── */}
        <div
          className="flip-card-face h-full rounded-[1.5rem] p-10 lg:p-12 flex flex-col justify-between"
          style={{ backgroundColor: bg }}
        >
          <div className="flex flex-col gap-5">
            <p
              className={`text-smallTag uppercase tracking-widest ${labelCls}`}
            >
              {label}
            </p>
            <h2 className={`text-h2 leading-tight ${titleCls}`}>{title}</h2>
            {price && (
              <p
                className={`text-h2 font-light leading-none ${isDark ? 'text-white/30' : 'text-[#3C3C3B]/30'}`}
              >
                {price}
              </p>
            )}
            <p className={`text-bigTag ${taglineCls}`}>{tagline}</p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <Link
              to="/contact"
              onClick={(e) => e.stopPropagation()}
              className={`self-start px-7 py-3.5 rounded-full text-body transition-opacity ${btnCls}`}
            >
              {ctaText}
            </Link>
            {badge && <ClaudeBadge />}
          </div>
        </div>

        {/* ── Back ── */}
        <div
          className="flip-card-face flip-card-back h-full rounded-[1.5rem] p-8 lg:p-10 flex flex-col gap-5 overflow-hidden"
          style={{ backgroundColor: bg }}
        >
          <p
            className={`text-smallTag uppercase tracking-widest shrink-0 ${labelCls}`}
          >
            {label}
          </p>

          <div className="flex flex-col gap-6 flex-1 overflow-hidden">
            {(sections ?? []).slice(0, 2).map((section, i) => (
              <div key={i} className="flex flex-col gap-2">
                {section.heading ? (
                  <h3 className="text-smallTag text-purple-accents uppercase tracking-widest">
                    {section.heading}
                  </h3>
                ) : undefined}
                <ul className="flex flex-col gap-1.5">
                  {section.items.slice(0, 5).map((item, j) => (
                    <li
                      key={j}
                      className={`text-sm leading-snug flex gap-2 ${bodyBackCls}`}
                    >
                      <span className="text-purple-accents shrink-0 font-mono">
                        {section.numbered
                          ? String(j + 1).padStart(2, '0')
                          : '—'}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            onClick={(e) => e.stopPropagation()}
            className={`self-start shrink-0 px-7 py-3.5 rounded-full text-body transition-opacity ${btnCls}`}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── FAQ item ────────────────────────────────────────────────── */

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-dark-primary">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-4 py-6 text-left cursor-pointer"
      aria-expanded={isOpen}
    >
      <span className="text-h4 text-dark-primary">{question}</span>
      <AccordionAnimation accordionOpen={isOpen} faqs />
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

/* ─── Page ────────────────────────────────────────────────────── */

const Services = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const seo = t('pageSeo.services');
  const page = t('servicesPage');

  const segment = location.pathname.split('/').find(Boolean);
  const lang = SUPPORTED_LANGS.includes(segment) ? segment : DEFAULT_LANG;
  const slugs = ROUTE_SLUGS[lang];
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  const serviceLinks = [
    `${langPrefix}/${slugs.CTO}`,
    `${langPrefix}/${slugs.ConsultoriaTec}`,
    `${langPrefix}/${slugs.software}`,
    `${langPrefix}/${slugs.aiAgents}`,
    `${langPrefix}/${slugs.iso27001}`,
  ];

  const serviceCardsRef = useRef(null);
  const engagementRef = useRef(null);

  const [activeFaq, setActiveFaq] = useState();
  const handleFaqClick = (i) =>
    setActiveFaq((prev) => (prev === i ? undefined : i));

  /* Scroll entrance — service cards */
  useGSAP(
    () => {
      const cards =
        serviceCardsRef.current.querySelectorAll('[data-anim-card]');
      gsap.set(cards, { autoAlpha: 0, y: 64 });
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power3.out',
          }),
      });
    },
    { scope: serviceCardsRef }
  );

  return (
    <>
      <SeoHelmet title={seo.title} description={seo.description} />

      {/* Hero */}
      <section className="px-landing mt-fixed-navbar pt-14 lg:pt-23 pb-16 lg:pb-20">
        <div className="max-w-[88.875rem] mx-auto">
          <p className="text-body text-purple-accents uppercase mb-4">
            {page.hero.suptitle}
          </p>
          <h1 className="text-h1 text-dark-primary max-w-3xl mb-4">
            {page.hero.title}
          </h1>
          <p className="text-subtitle text-dark-medium max-w-xl">
            {page.hero.description}
          </p>
        </div>
      </section>

      {/* Service cards — hover/tap to flip and reveal sections */}
      <section ref={serviceCardsRef} className="px-landing pb-24 lg:pb-36">
        <div className="max-w-[88.875rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {page.services.map((service, i) => (
            <OffMenuCard
              key={service.number}
              label={service.number}
              title={service.title}
              tagline={service.tagline}
              isDark={i === 0 || i === 4}
              ctaText={page.cta.buttonText}
              sections={i === 4 ? [service.sections[0]] : service.sections}
              badge={service.number === '02' || service.number === '03'}
              link={serviceLinks[i]}
            />
          ))}
        </div>
      </section>

      {/* Engagement model cards */}
      <section ref={engagementRef} className="px-landing py-16 lg:py-24">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-10 lg:mb-14">
            {page.engagement.title}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {page.engagement.models.map((model, i) => (
              <OffMenuCard
                key={i}
                label={model.type}
                title={model.subtitle}
                price={model.price}
                tagline={model.description}
                isDark={i % 2 === 0}
                ctaText={page.cta.buttonText}
                sections={[{ heading: '', items: model.items }]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-landing py-16 lg:py-24">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-10 lg:mb-14">
            {page.faq.title}
          </h2>
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
          <h2 className="text-h2 text-dark-primary max-w-2xl">
            {page.cta.title}
          </h2>
          <ButtonLink link="/contact" text={page.cta.buttonText} />
        </div>
      </section>
    </>
  );
};

export default Services;
