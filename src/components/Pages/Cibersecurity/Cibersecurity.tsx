'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import Hero from 'shared/Hero';
import HowWeWork from 'shared/HowWeWork';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';
import Form from '../../Form';

type FaqItem = { question: string; answer: string };

const Cibersecurity = () => {
  const t = useTranslations('cibersecurity');

  const hero = t.raw('hero') as Parameters<typeof Hero>[0];
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof HowWeWork>[0];
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} heroLink="#contacto" />
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <div className="wrapper">
        <Form formId="service-cybersecurity" defaultServiceIndex={4} />
      </div>
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Cibersecurity;
