import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Home from '../../../src/components/Home/Home';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'home' });
  const canonical = locale === 'es' ? `${ORIGIN}/es` : ORIGIN;

  return {
    title: t('title'),
    description: t('metadescription'),
    alternates: {
      canonical,
      languages: {
        en: ORIGIN,
        es: `${ORIGIN}/es`,
        'x-default': ORIGIN,
      },
    },
    openGraph: { title: t('title'), description: t('metadescription'), url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function HomePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale });

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gigson Solutions',
    url: ORIGIN,
    logo: `${ORIGIN}/gigson-logo.svg`,
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'hola@gigsonsolutions.com' },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gigson Solutions',
    url: ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${ORIGIN}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <Home />
    </>
  );
}
