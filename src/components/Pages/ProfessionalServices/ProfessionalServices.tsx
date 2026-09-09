'use client';

import { useTranslations } from 'next-intl';

import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';
import Brand from '../../../shared/ui/Brand';
import { ButtonLink } from '../../../shared/ui/Button';
import Hero from '../../../shared/ui/Hero';
import HowWeWork from '../../../shared/ui/HowWeWork';
import ImproveAreas from '../../../shared/ui/ImproveAreas';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';
import SolutionsApplications from '../../../shared/ui/SolutionsApplications';
import UseCases from '../../../shared/ui/UseCases';

const bgSrc = typeof useCasesBgGradient === 'string' ? useCasesBgGradient : (useCasesBgGradient as { src: string }).src;

const bgStyle = {
  backgroundImage: `url(${bgSrc})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

type FaqItem = { question: string; answer: string };
type AiAgentsCta = { title: string; description: string; buttonText: string };

const ProfessionalServices = () => {
  const t = useTranslations('cases-professional-services');

  const hero = t.raw('hero') as Parameters<typeof Hero>[0];
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const useCases = t.raw('useCases') as Parameters<typeof UseCases>[0];
  const improveAreas = t.raw('improveAreas') as Parameters<typeof ImproveAreas>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof HowWeWork>[0];
  const digitalProduct = t.raw('digitalProduct') as { buttonText: string };
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;
  const aiAgentsCta = t.raw('aiAgentsCta') as AiAgentsCta | undefined;

  return (
    <>
      <Hero {...hero} />
      <section style={bgStyle}>
        <UseCases {...useCases} />
        <ImproveAreas {...improveAreas} />
      </section>
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <section className="flex justify-center py-14 lg:py-20 px-landing">
        <ButtonLink link="/contact" text={digitalProduct.buttonText} outlined />
      </section>
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      {aiAgentsCta && (
        <section className="flex flex-col items-center gap-4 py-14 lg:py-20 px-landing text-center">
          <h2>{aiAgentsCta.title}</h2>
          <p>{aiAgentsCta.description}</p>
          <ButtonLink link="/ai-agents" text={aiAgentsCta.buttonText} />
        </section>
      )}
      <Brand />
    </>
  );
};

export default ProfessionalServices;
