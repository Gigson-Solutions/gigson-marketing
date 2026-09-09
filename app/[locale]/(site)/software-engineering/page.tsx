import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Software from '../../../../src/components/Pages/Software/Software';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'software' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/ingenieria-software` : `${ORIGIN}/software-engineering`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/software-engineering`, es: `${ORIGIN}/es/ingenieria-software`, 'x-default': `${ORIGIN}/software-engineering` },
    },
    openGraph: { title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function SoftwareEngineeringPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'software' });
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: t('title'), description: t('metadescription'),
    url: `${ORIGIN}/software-engineering`, serviceType: 'Software Engineering',
    areaServed: 'ES', provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Software />
    </>
  );
}
