'use client';

import { useTranslations } from 'next-intl';

import { Shape2D, Wireframe3D } from '../../../design-system/shapes';
import FeatureGrid from '../../../shared/ui/FeatureGrid';
import ProcessSteps from '../../../shared/ui/ProcessSteps';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';
import StatsBar from '../../../shared/ui/StatsBar';
import { ODOO_INTEGRATION_LOGOS, ODOO_TOOL_OPTIONS } from './data/integrationLogos';
import IntegrationContactForm from './IntegrationContactForm';
import IntegrationLogosGrid from './IntegrationLogosGrid';
import IntegrationsHero from './IntegrationsHero';
import IntegrationUseCases from './IntegrationUseCases';

type FaqItem = { question: string; answer: string };

// Composed directly (not via IntegrationPageLayout) — same rationale as
// /integrations-holded: enough dedicated sections now that the generic
// layout's props would need too many one-off flags.
const NAMESPACE = 'integrations-odoo';

const IntegrationsOdoo = () => {
  const t = useTranslations(NAMESPACE);
  const stats = t.raw('stats') as { items: { value: string; label: string }[] };
  const edi = t.raw('edi') as Parameters<typeof FeatureGrid>[0];
  const shipping = t.raw('shipping') as Parameters<typeof FeatureGrid>[0];
  const ecommerce = t.raw('ecommerce') as Parameters<typeof FeatureGrid>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof ProcessSteps>[0];
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  return (
    <>
      <IntegrationsHero namespace={NAMESPACE} logoUrl="/img/logos-negros/odoo-holded.png" />

      <div className="relative">
        <Wireframe3D
          name="cube"
          size={120}
          speed={0}
          interactive={false}
          className="hidden lg:block absolute right-10 top-6 opacity-70"
        />
        <StatsBar stats={stats.items} />
      </div>

      <IntegrationUseCases namespace={NAMESPACE} />

      <FeatureGrid {...edi} id="edi" />
      <FeatureGrid {...shipping} id="logistica" />
      <FeatureGrid {...ecommerce} id="ecommerce" />

      <div className="relative">
        <Wireframe3D
          name="icosahedron"
          size={140}
          className="hidden lg:block absolute right-10 top-10 opacity-70"
        />
        <ProcessSteps {...howWeWork} />
      </div>

      <IntegrationLogosGrid namespace={NAMESPACE} logos={ODOO_INTEGRATION_LOGOS} />

      {faq && (
        <div className="relative">
          <Shape2D
            name="radial"
            params={{ sides: 24 }}
            size={110}
            className="hidden lg:block absolute left-10 top-4 opacity-60"
          />
          <ServiceFaq title={faq.title} faqs={faq.items} />
        </div>
      )}

      <IntegrationContactForm
        namespace={NAMESPACE}
        formEmail="jaume@somosgigson.com"
        formSubject="Nueva consulta de integraciones Odoo"
        toolOptions={ODOO_TOOL_OPTIONS}
      />
    </>
  );
};

export default IntegrationsOdoo;
