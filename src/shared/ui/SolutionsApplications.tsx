'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';

import chevronDownIcon from '../../assets/chevron-down.svg';
import solutionsApplicationsBgGradient from '../../assets/solutions-applications-bg-gradients-1.svg';
import { RichText } from './RichText';
import { useBreakpoint } from './hooks/useBreakpoint';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const getCardNr = (index: number) => String(index).padStart(2, '0');

type CardProps = {
  title: string;
  description: string;
  cardNr: string;
  className?: string;
};

const Card = ({ title, description, cardNr, className = '' }: CardProps) => (
  <div
    data-card
    className={`hidden flex-1 md:flex flex-col border-t-[0.5px] border-t-dark-primary pb-4 md:pb-12 ${className}`}
  >
    <span className="text-bigTag text-purple-accents">{cardNr}</span>
    <h4 className="text-h4 text-dark-primary md:mb-6">{title}</h4>
    <p className="block text-body text-dark-medium">{description}</p>
  </div>
);

const CardMobile = ({ title, description, cardNr, className = '' }: CardProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-card
      className={`md:hidden flex-1 flex flex-col border-t-[0.5px] border-t-dark-primary pb-4 md:pb-12 ${className}`}
    >
      <button onClick={() => setOpen((prev) => !prev)} className="cursor-pointer flex">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-bigTag text-purple-accents">{cardNr}</span>
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-h4 text-dark-primary">{title}</h4>
            <img
              src={typeof chevronDownIcon === 'string' ? chevronDownIcon : (chevronDownIcon as { src: string }).src}
              alt=""
              className={`h-7 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </div>
          <p className={`${open ? 'block' : 'hidden'} text-body text-dark-medium`}>{description}</p>
        </div>
      </button>
    </div>
  );
};

type Container = {
  title: string;
  description: string;
  type: string;
  cards: { title: string; description: string }[];
};

type SolutionsApplicationsProps = {
  title: string;
  subTitle: string;
  containers: Container[];
};

const SolutionsApplications = ({ title, subTitle, containers }: SolutionsApplicationsProps) => {
  const { isMobile } = useBreakpoint();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = sectionRef.current!.querySelectorAll('[data-card]');
      gsap.set(cards, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        once: true,
        onEnter: (elements) => {
          gsap.to(elements, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out' });
        },
      });
    },
    { scope: sectionRef }
  );

  const bgSrc = typeof solutionsApplicationsBgGradient === 'string'
    ? solutionsApplicationsBgGradient
    : (solutionsApplicationsBgGradient as { src: string }).src;

  return (
    <section
      ref={sectionRef}
      className="px-landing py-10 lg:py-25"
      style={{ backgroundImage: `url(${bgSrc})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
    >
      <div className="max-w-[88.875rem] mx-auto flex flex-col text-dark-primary">
        <div className="mb-6 lg:mb-10">
          <RichText as="h2" content={title} className="text-h2 text-dark-primary mb-4" />
          <p className="text-subtitle text-dark-primary">{subTitle}</p>
        </div>

        <div className="flex flex-col gap-y-10">
          {containers?.map(({ title: cTitle, description, type, cards }, index) => {
            const isPairContainer = (index + 1) % 2 === 0;
            const initialTwoCards = cards.slice(0, 2);
            const remainingCards = cards.slice(2);
            const mainCardClass = isPairContainer
              ? 'md:order-last md:rounded-tr-4xl md:rounded-tl-lg lg:ml-14'
              : 'md:order-first md:rounded-tl-4xl md:rounded-tr-lg lg:mr-14';
            const cardNr = getCardNr(index + 1);

            return (
              <div key={index} className="flex flex-col md:grid md:grid-cols-3 gap-6">
                <div className={`bg-gradient-to-b from-[#7874F4] to-[#5E5BC6] text-white px-2 md:px-4 py-8 rounded-t-4xl rounded-b-lg mb-6 md:mb-0 ${mainCardClass}`}>
                  <p className="text-smallTag uppercase">{type}</p>
                  <h3 className="text-h3 mb-4 md:mb-0">{cardNr}. {cTitle}</h3>
                  <p className="md:hidden px-2 text-bigTag md:mt-10">{description}</p>
                </div>
                <div className="flex flex-col gap-6 col-span-2">
                  <p className="hidden md:block text-bigTag md:mt-10">{description}</p>
                  <div className="flex flex-col md:flex-row gap-6">
                    {initialTwoCards.map(({ title: t, description: d }, i) => (
                      <div key={i} className="flex-1">
                        {isMobile
                          ? <CardMobile title={t} description={d} cardNr={getCardNr(i + 1)} />
                          : <Card title={t} description={d} cardNr={getCardNr(i + 1)} />}
                      </div>
                    ))}
                  </div>
                  {remainingCards.length > 0 && (
                    <div className={`flex flex-col md:grid ${remainingCards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                      {remainingCards.map(({ title: t, description: d }, i) => {
                        const flexCardIndex = i + 3;
                        const isLongCard = flexCardIndex % 6 === 0 || remainingCards.length === 1;
                        return (
                          <Card key={i} title={t} description={d} cardNr={getCardNr(flexCardIndex)} className={isLongCard ? 'col-span-3' : ''} />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsApplications;
