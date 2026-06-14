import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Faqs from '../../../src/components/Pages/Faqs/Faqs';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('faqs') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/preguntas-frecuentes` : `${ORIGIN}/faqs`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/faqs`,
        es: `${ORIGIN}/es/preguntas-frecuentes`,
        'x-default': `${ORIGIN}/faqs`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical },
  };
}

export default async function FaqsPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale });
  const faqsData = t.raw('faqsDropdown') as { question?: string; answer?: string }[];
  const validFaqs = faqsData.filter((f) => f.question && f.answer);

  const faqSchema = validFaqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: validFaqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Faqs />
    </>
  );
}
