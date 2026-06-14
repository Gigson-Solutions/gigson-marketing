import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Cibersecurity from '../../../../src/components/Pages/Cibersecurity/Cibersecurity';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'cibersecurity' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/ciberseguridad` : `${ORIGIN}/cybersecurity`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/cybersecurity`, es: `${ORIGIN}/es/ciberseguridad`, 'x-default': `${ORIGIN}/cybersecurity` },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function CybersecurityPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'cibersecurity' });
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: t('title'), description: t('metadescription'),
    url: `${ORIGIN}/cybersecurity`, serviceType: 'Cybersecurity',
    areaServed: 'ES', provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Cibersecurity />
    </>
  );
}
