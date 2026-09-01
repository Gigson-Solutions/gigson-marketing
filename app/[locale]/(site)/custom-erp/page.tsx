import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import CustomErp from '../../../../src/components/Pages/CustomErp/CustomErp';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'customErp' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es' ? `${ORIGIN}/es/erp-a-medida` : `${ORIGIN}/custom-erp`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/custom-erp`,
        es: `${ORIGIN}/es/erp-a-medida`,
        'x-default': `${ORIGIN}/custom-erp`,
      },
    },
    openGraph: { title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function CustomErpPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'customErp' });
  const title = t('title');
  const description = t('metadescription');
  const serviceUrl = locale === 'es' ? '/es/erp-a-medida' : '/custom-erp';
  const faqItems = (t.raw('faq') as { items?: { question: string; answer: string }[] } | undefined)?.items ?? [];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${ORIGIN}${serviceUrl}`,
    serviceType: 'Custom ERP Development',
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
      <CustomErp />
    </>
  );
}
