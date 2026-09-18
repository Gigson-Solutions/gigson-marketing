import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import IntegrationsOdoo from '../../../../src/components/Pages/Integrations/IntegrationsOdoo';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import {
  ORIGIN,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  breadcrumbLabel,
  faqItemsFrom,
} from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'integrations-odoo' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/integraciones-odoo`
    : `${ORIGIN}/integrations-odoo`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/integrations-odoo`,
        es: `${ORIGIN}/es/integraciones-odoo`,
        'x-default': `${ORIGIN}/integrations-odoo`,
      },
    },
    openGraph: { type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function IntegrationsOdooPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'integrations-odoo' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/integrations-odoo',
    locale,
    serviceType: 'Systems Integration',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/integrations-odoo' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <IntegrationsOdoo />
    </>
  );
}
