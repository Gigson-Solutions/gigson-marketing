'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import { ButtonLink } from 'shared/Button';
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
  const digitalProduct = t.raw('digitalProduct') as { buttonText: string };
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <ProcessSteps {...howWeWork} />
      <section className="flex justify-center py-14 lg:py-20 px-landing">
        <ButtonLink link="/contact" text={digitalProduct.buttonText} outlined />
      </section>
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default CTO;
