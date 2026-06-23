'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Accordion } from '../../Accordion/Accordion';

type UseCaseItem = { title: string; challenge: string };
type UseCasesData = {
  label: string;
  items: UseCaseItem[];
  featuresTitle?: string;
  solutionTitle?: string;
};

const IntegrationUseCases = ({ namespace }: { namespace: string }) => {
  const t = useTranslations(namespace);
  const useCases = t.raw('useCases') as UseCasesData;
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  return (
    <section id="casos" className="px-landing py-14 lg:py-20 bg-white">
      <div className="max-w-[88.875rem] mx-auto">
        <p className="text-purple-accents text-body1 uppercase mb-10 tracking-widest">
          {useCases.label}
        </p>
        <div className="accordions-container">
          {useCases.items.map(({ title, challenge }, i) => (
            <Accordion
              key={i}
              title={title}
              challenge={challenge}
              isOpen={activeIndex === i}
              onClick={() => setActiveIndex((prev) => (prev === i ? undefined : i))}
              classContainer="accordions-container"
              ctaHref="#contacto"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationUseCases;
