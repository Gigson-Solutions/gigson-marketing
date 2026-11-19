import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Iso42001Service from '../../../../src/components/Pages/Iso42001Service/Iso42001Service';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import {
  ORIGIN,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  breadcrumbLabel,
  faqItemsFrom,
  SITE_NAME,
} from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: 'iso42001Service' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/iso-42001`
    : `${ORIGIN}/iso-42001`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/iso-42001`,
        es: `${ORIGIN}/es/iso-42001`,
        'x-default': `${ORIGIN}/iso-42001`,
      },
    },
    openGraph: { siteName: SITE_NAME, type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function Iso42001ServicePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'iso42001Service' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/iso-42001',
    locale,
    serviceType: 'ISO 42001 Certification',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/iso-42001' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Iso42001Service />
    </>
  );
}
