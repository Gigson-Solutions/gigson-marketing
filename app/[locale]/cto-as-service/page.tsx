import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import CTO from '../../../src/components/Pages/CTO/CTO';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'CTO' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/cto-as-service` : `${ORIGIN}/cto-as-service`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        es: `${ORIGIN}/es/cto-as-service`,
        'x-default': canonical,
      },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function CTOPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'CTO' });
  const title = t('title');
  const description = t('metadescription');
  const faqItems = (t.raw('faq') as { items?: { question: string; answer: string }[] } | undefined)?.items ?? [];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${ORIGIN}/cto-as-service`,
    serviceType: 'CTO as a Service',
    areaServed: 'ES',
    provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
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
      <CTO />
    </>
  );
}
