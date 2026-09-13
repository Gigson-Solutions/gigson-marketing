import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Faqs from '../../../../src/components/Pages/Faqs/Faqs';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { ORIGIN, buildBreadcrumbSchema, buildFaqSchema } from '../../../../lib/schema';


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
    openGraph: { title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
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

  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const tMenu = await getTranslations({ locale, namespace: 'menu' });

  const faqSchema = buildFaqSchema(validFaqs as { question: string; answer: string }[]);
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('faqs'), pathKey: '/faqs' },
    ],
    locale,
  );

  return (
    <>
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <Faqs />
    </>
  );
}
