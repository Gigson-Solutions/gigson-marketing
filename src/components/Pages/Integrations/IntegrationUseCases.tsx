'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Accordion } from '../../Accordion/Accordion';

type UseCaseItem = { title: string; description: string };
type UseCasesData = {
  label: string;
  items: UseCaseItem[];
};

const IntegrationUseCases = () => {
  const t = useTranslations('integrations-holded');
  const useCases = t.raw('useCases') as UseCasesData;
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  return (
    <section id="casos" className="px-landing py-14 lg:py-20 bg-white">
      <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row lg:gap-20">
        {/* Left label */}
        <div className="lg:w-48 flex-shrink-0 mb-8 lg:mb-0">
          <p className="text-purple-accents text-body1 uppercase tracking-widest lg:sticky lg:top-32">
            {useCases.label}
          </p>
        </div>

        {/* Right accordions */}
        <div className="flex-1 cases">
          <div className="accordions-container">
            {useCases.items.map(({ title, description }, i) => (
              <Accordion
                key={i}
                title={title}
                challenge={description}
                isOpen={activeIndex === i}
                onClick={() => setActiveIndex((prev) => (prev === i ? undefined : i))}
                classContainer="accordions-container"
                ctaHref="#contacto"
                inlineCTA
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationUseCases;
