import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Contact from '../../../../src/components/Pages/Contact';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('contact') as { title: string; description: string };
  const canonicalBase = locale === 'es' ? `${ORIGIN}/es/contacto` : `${ORIGIN}/contact`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalBase,
      languages: {
        en: `${ORIGIN}/contact`,
        es: `${ORIGIN}/es/contacto`,
        'x-default': `${ORIGIN}/contact`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonicalBase, images: ['/opengraph-image'] },
  };
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gigson Solutions',
  url: ORIGIN,
  logo: `${ORIGIN}/img/gigson-solutions-logo.png`,
  email: 'emmelin@gigsonsolutions.com',
  sameAs: ['https://www.linkedin.com/company/gigson-solutions'],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Contact />
    </>
  );
}
