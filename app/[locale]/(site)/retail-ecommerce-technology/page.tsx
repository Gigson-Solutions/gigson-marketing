import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Retail from '../../../../src/components/Pages/Retail/Retail';
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

  const t = await getTranslations({ locale, namespace: 'cases-retail' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/tecnologia-retail-ecommerce` : `${ORIGIN}/retail-ecommerce-technology`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/retail-ecommerce-technology`, es: `${ORIGIN}/es/tecnologia-retail-ecommerce`, 'x-default': `${ORIGIN}/retail-ecommerce-technology` },
    },
    openGraph: { title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function RetailEcommerceTechnologyPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'cases-retail' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/retail-ecommerce-technology',
    locale,
    serviceType: 'Retail Technology',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/retail-ecommerce-technology' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Retail />
    </>
  );
}
