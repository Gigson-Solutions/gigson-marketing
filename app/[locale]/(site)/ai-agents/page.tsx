import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import AiAgents from '../../../../src/components/Pages/AiAgents/AiAgents';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'aiAgents' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/agentes-ia` : `${ORIGIN}/ai-agents`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/ai-agents`,
        es: `${ORIGIN}/es/agentes-ia`,
        'x-default': `${ORIGIN}/ai-agents`,
      },
    },
    openGraph: { title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function AiAgentsPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'aiAgents' });
  const title = t('title');
  const description = t('metadescription');
  const serviceUrl = locale === 'es' ? '/es/agentes-ia' : '/ai-agents';
  const faqItems = (t.raw('faq') as { items?: { question: string; answer: string }[] } | undefined)?.items ?? [];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${ORIGIN}${serviceUrl}`,
    serviceType: 'AI Agent Implementation',
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
      <AiAgents />
    </>
  );
}
