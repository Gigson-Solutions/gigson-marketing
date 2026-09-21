import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Pricing from '../../../../src/components/Pages/Pricing/Pricing';
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

  const t = await getTranslations({ locale, namespace: 'pricing' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/precios` : `${ORIGIN}/pricing`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/pricing`,
        es: `${ORIGIN}/es/precios`,
        'x-default': `${ORIGIN}/pricing`,
      },
    },
    openGraph: { type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function PricingPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'pricing' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  // The bounds of the two published ranges: 8.000-15.000 € for a scoped agent
  // and 20.000-50.000 € once several systems are integrated. Both are stated on
  // the page itself (`pricing.tiers.rows`) and are the same figures the chatbot
  // has been quoting, so the structured data adds no claim the site doesn't make.
  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/pricing',
    locale,
    serviceType: 'AI Agent Implementation',
    offers: { lowPrice: 8000, highPrice: 50000, priceCurrency: 'EUR', offerCount: 2 },
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/pricing' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Pricing />
    </>
  );
}
