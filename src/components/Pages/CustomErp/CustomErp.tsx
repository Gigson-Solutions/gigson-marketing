'use client';

import { useTranslations } from 'next-intl';
import Brand from 'shared/Brand';
import Hero from 'shared/Hero';
import ProcessSteps from 'shared/ProcessSteps';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';

import { Link } from '../../../../i18n/navigation';
import { CUSTOM_ERP_TOOL_OPTIONS } from '../Integrations/data/integrationLogos';
import IntegrationContactForm from '../Integrations/IntegrationContactForm';

type FaqItem = { question: string; answer: string };

type SectorRoute =
  | '/logistics-technology'
  | '/retail-ecommerce-technology'
  | '/construction-technology'
  | '/professional-services-technology';

const CustomErp = () => {
  const t = useTranslations('customErp');
  const tMenu = useTranslations('menu');

  const hero = t.raw('hero') as { title: string; suptitle: string; description: string; buttonText: string };
  const solutionsApplications = t.raw('solutionsApplications') as { title: string; subTitle: string; containers: unknown[] };
  const howWeWork = t.raw('howWeWork') as { eyebrow?: string; h2a: string; h2b?: string; lead?: string; steps: { title: string; description: string }[] };
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;
  const sectorsCta = t.raw('sectorsCta') as { title: string } | undefined;

  const sectorLinks: { href: SectorRoute; label: string }[] = [
    { href: '/logistics-technology', label: tMenu('logistics') },
    { href: '/retail-ecommerce-technology', label: tMenu('retail') },
    { href: '/construction-technology', label: tMenu('construction') },
    { href: '/professional-services-technology', label: tMenu('professional_services') },
  ];

  return (
    <>
      <Hero {...hero} heroLink="#contacto" />
      <SolutionsApplications {...(solutionsApplications as Parameters<typeof SolutionsApplications>[0])} />
      <ProcessSteps {...howWeWork} />
      {/* Same form component as /integrations-odoo and /integrations-holded,
          just a different namespace/toolOptions (system type instead of a
          third-party tool to connect) — no logos grid, no partner disclaimer. */}
      <IntegrationContactForm
        namespace="customErp"
        formEmail="jaume@somosgigson.com"
        formSubject="Nueva consulta de ERP a medida"
        toolOptions={CUSTOM_ERP_TOOL_OPTIONS}
      />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      {sectorsCta && (
        <section className="flex flex-col items-center gap-4 py-10 px-landing text-center">
          <h2>{sectorsCta.title}</h2>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {sectorLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="underline">
                {label}
              </Link>
            ))}
          </nav>
        </section>
      )}
      <Brand />
    </>
  );
};

export default CustomErp;
