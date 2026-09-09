import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ConsultoriaTec from '../../../../src/components/Pages/ConsultoriaTec/ConsultoriaTec';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'consultoriaTec' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/consultoria-tecnologica` : `${ORIGIN}/technology-consulting`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/technology-consulting`, es: `${ORIGIN}/es/consultoria-tecnologica`, 'x-default': `${ORIGIN}/technology-consulting` },
    },
    openGraph: { title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function TechnologyConsultingPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'consultoriaTec' });
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: t('title'), description: t('metadescription'),
    url: `${ORIGIN}/technology-consulting`, serviceType: 'Technology Consulting',
    areaServed: 'ES', provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ConsultoriaTec />
    </>
  );
}
