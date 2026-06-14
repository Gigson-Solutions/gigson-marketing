import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import AboutHero from '../../../../src/components/About/AboutHero';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('about') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/sobre-nosotros` : `${ORIGIN}/about`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/about`, es: `${ORIGIN}/es/sobre-nosotros`, 'x-default': `${ORIGIN}/about` },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical },
  };
}

export default async function AboutPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('about') as { title: string; description: string };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gigson Solutions',
    url: ORIGIN,
    description: seo.description,
    foundingDate: '2021',
    areaServed: ['ES', 'MX', 'AR', 'PE'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <AboutHero />
    </>
  );
}
