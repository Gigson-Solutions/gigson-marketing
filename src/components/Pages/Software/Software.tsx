'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import Hero from 'shared/Hero';
import ProcessSteps from 'shared/ProcessSteps';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';
import Form from '../../Form';

type FaqItem = { question: string; answer: string };

const Software = () => {
  const t = useTranslations('software');

  const hero = t.raw('hero') as Parameters<typeof Hero>[0];
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof ProcessSteps>[0];
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <Hero {...hero} heroLink="#contacto" />
      <SolutionsApplications {...solutionsApplications} />
      <ProcessSteps {...howWeWork} />
      <div className="wrapper">
        <Form formId="service-software-engineering" defaultServiceIndex={2} />
      </div>
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Software;
