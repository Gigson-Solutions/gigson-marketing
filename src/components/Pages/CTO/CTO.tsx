'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import DigitalProduct from 'shared/DigitalProduct';
import Hero from 'shared/Hero';
import ProcessSteps from 'shared/ProcessSteps';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';

type FaqItem = { question: string; answer: string };

const CTO = () => {
  const t = useTranslations('CTO');

  const hero = t.raw('hero') as { title: string; suptitle: string; description: string; buttonText: string };
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof ProcessSteps>[0];
  const digitalProduct = t.raw('digitalProduct') as Parameters<typeof DigitalProduct>[0];
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <ProcessSteps {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default CTO;
