import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Cases from '../../../../src/components/Pages/Cases/Cases';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { ORIGIN, buildBreadcrumbSchema, localizedUrl } from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('cases') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/casos` : `${ORIGIN}/cases`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/cases`,
        es: `${ORIGIN}/es/casos`,
        'x-default': `${ORIGIN}/cases`,
      },
    },
    openGraph: { type: 'website', title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function CasesPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale });
  const casesData = t.raw('casesDropdown') as { title: string; challenge: string }[];

  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const tMenu = await getTranslations({ locale, namespace: 'menu' });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Case Studies — Gigson Solutions',
    // Was hardcoded to the English path, so /es/casos advertised itself as /cases.
    url: localizedUrl('/cases', locale),
    itemListElement: casesData.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      description: c.challenge,
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('cases'), pathKey: '/cases' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Cases />
    </>
  );
}
