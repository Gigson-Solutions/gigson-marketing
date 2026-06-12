'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import DigitalProduct from 'shared/DigitalProduct';
import Hero from 'shared/Hero';
import HowWeWork from 'shared/HowWeWork';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';

type FaqItem = { question: string; answer: string };

const Cibersecurity = () => {
  const t = useTranslations('cibersecurity');

  const hero = t.raw('hero') as Parameters<typeof Hero>[0];
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof HowWeWork>[0];
  const digitalProduct = t.raw('digitalProduct') as Parameters<typeof DigitalProduct>[0];
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Cibersecurity;
