import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ProfessionalServices from '../../../../src/components/Pages/ProfessionalServices/ProfessionalServices';
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

  const t = await getTranslations({ locale, namespace: 'cases-professional-services' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/servicios-profesionales` : `${ORIGIN}/professional-services-technology`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/professional-services-technology`, es: `${ORIGIN}/es/servicios-profesionales`, 'x-default': `${ORIGIN}/professional-services-technology` },
    },
    openGraph: { type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function ProfessionalServicesTechnologyPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'cases-professional-services' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/professional-services-technology',
    locale,
    serviceType: 'Professional Services Technology',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/professional-services-technology' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <ProfessionalServices />
    </>
  );
}
