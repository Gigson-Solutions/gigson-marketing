import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Iso27001 from '../../../src/components/Pages/Iso27001/Iso27001';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'iso27001' });
  const title = t('seo.title');
  const description = t('seo.description');
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/certificacion-iso-27001`
    : `${ORIGIN}/iso-27001-certification`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/iso-27001-certification`,
        es: `${ORIGIN}/es/certificacion-iso-27001`,
        'x-default': `${ORIGIN}/iso-27001-certification`,
      },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function Iso27001Page(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'iso27001' });

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('seo.title'),
    description: t('seo.description'),
    url: `${ORIGIN}/iso-27001-certification`,
    serviceType: 'ISO 27001 Certification',
    provider: {
      '@type': 'Organization',
      name: 'Gigson Solutions',
      url: ORIGIN,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Iso27001 />
    </>
  );
}
