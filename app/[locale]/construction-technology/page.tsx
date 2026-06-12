import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Construction from '../../../src/components/Pages/Construction/Construction';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'cases-construction' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/tecnologia-construccion` : `${ORIGIN}/construction-technology`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/construction-technology`, es: `${ORIGIN}/es/tecnologia-construccion`, 'x-default': `${ORIGIN}/construction-technology` },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function ConstructionTechnologyPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'cases-construction' });
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: t('title'), description: t('metadescription'),
    url: `${ORIGIN}/construction-technology`, serviceType: 'Construction Technology',
    areaServed: 'ES', provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Construction />
    </>
  );
}
