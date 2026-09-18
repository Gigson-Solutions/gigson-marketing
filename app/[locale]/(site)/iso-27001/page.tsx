import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Iso27001Service from '../../../../src/components/Pages/Iso27001Service/Iso27001Service';
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
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: 'iso27001Service' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/iso-27001`
    : `${ORIGIN}/iso-27001`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/iso-27001`,
        es: `${ORIGIN}/es/iso-27001`,
        'x-default': `${ORIGIN}/iso-27001`,
      },
    },
    openGraph: { type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function Iso27001ServicePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'iso27001Service' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const title = t('title');
  const description = t('metadescription');

  const serviceSchema = buildServiceSchema({
    name: title,
    description,
    pathKey: '/iso-27001',
    locale,
    serviceType: 'ISO 27001 Certification',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/iso-27001' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Iso27001Service />
    </>
  );
}
