import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ClaudePartner from '../../../src/components/Pages/ClaudePartner/ClaudePartner';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'claudePartner' });
  const seo = t.raw('seo') as { title: string; description: string };
  const canonical =
    locale === 'es' ? `${ORIGIN}/es/sobre-claude-partner` : `${ORIGIN}/about-claude-partner`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/about-claude-partner`,
        es: `${ORIGIN}/es/sobre-claude-partner`,
        'x-default': `${ORIGIN}/about-claude-partner`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical },
  };
}

export default async function ClaudePartnerPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'claudePartner' });
  const seo = t.raw('seo') as { title: string; description: string };
  const serviceUrl =
    locale === 'es' ? '/es/sobre-claude-partner' : '/about-claude-partner';
  const faqItems =
    (t.raw('faq') as { items?: { question: string; answer: string }[] } | undefined)?.items ?? [];

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gigson Solutions',
    url: ORIGIN,
    description: seo.description,
    knowsAbout: ['Artificial Intelligence', 'Claude AI', 'Anthropic'],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: seo.title,
    description: seo.description,
    url: `${ORIGIN}${serviceUrl}`,
    serviceType: 'AI Consulting',
    areaServed: 'ES',
    provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };

  const faqSchema =
    faqItems.length > 0
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ClaudePartner />
    </>
  );
}
