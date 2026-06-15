import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Iso27001Service from '../../../../src/components/Pages/Iso27001Service/Iso27001Service';

const ORIGIN = 'https://gigsonsolutions.com';
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
    openGraph: { title, description, url: canonical },
  };
}

export default async function Iso27001ServicePage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: 'iso27001Service' });
  const title = t('title');
  const description = t('metadescription');
  const faqItems = (t.raw('faq') as { items?: { question: string; answer: string }[] } | undefined)?.items ?? [];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${ORIGIN}/iso-27001`,
    serviceType: 'ISO 27001 Certification',
    areaServed: 'ES',
    provider: {
      '@type': 'Organization',
      name: 'Gigson Solutions',
      url: ORIGIN,
    },
  };

  const faqSchema = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Iso27001Service />
    </>
  );
}
