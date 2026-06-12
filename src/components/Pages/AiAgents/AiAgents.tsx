'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import DigitalProduct from 'shared/DigitalProduct';
import Hero from 'shared/Hero';
import ProcessSteps from 'shared/ProcessSteps';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';

type FaqItem = { question: string; answer: string };

const AiAgents = () => {
  const t = useTranslations('aiAgents');

  const hero = t.raw('hero') as { title: string; suptitle: string; description: string; buttonText: string };
  const solutionsApplications = t.raw('solutionsApplications') as { title: string; subTitle: string; containers: unknown[] };
  const howWeWork = t.raw('howWeWork') as { eyebrow?: string; h2a: string; h2b?: string; lead?: string; steps: { title: string; description: string }[] };
  const digitalProduct = t.raw('digitalProduct') as { title: string; buttonText: string; description: string; cards: { title: string; description: string }[] };
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} />
      <SolutionsApplications {...(solutionsApplications as Parameters<typeof SolutionsApplications>[0])} />
      <ProcessSteps {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default AiAgents;
