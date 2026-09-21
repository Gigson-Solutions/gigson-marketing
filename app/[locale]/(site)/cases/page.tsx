import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Cases from '../../../../src/components/Pages/Cases/Cases';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { getCases, textRows } from '../../../../lib/cases';
import { ORIGIN, buildBreadcrumbSchema, caseUrl, localizedUrl } from '../../../../lib/schema';

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

  // Cases live in Payload now. While the collection is empty — between the
  // deploy that creates the table and whoever runs the seed — this falls back
  // to the `casesDropdown` copy the page has always rendered, so the index
  // never goes blank. Those fallback entries carry no slug, so they list
  // without a link to a detail page that doesn't exist yet.
  const payloadCases = await getCases(locale);
  const items = payloadCases.map((c) => ({
    slug: c.slug,
    title: c.title,
    challenge: c.challenge,
    solution: c.solution ?? '',
    features: textRows(c.features),
    results: textRows(c.results),
    tools: textRows(c.tools),
    tags: textRows(c.tags),
    need: textRows(c.need),
  }));

  const casesData: { title: string; challenge: string; url?: string }[] =
    items.length > 0
      ? payloadCases.map((c) => ({ title: c.title, challenge: c.challenge, url: caseUrl(c) }))
      : (t.raw('casesDropdown') as { title: string; challenge: string }[]);

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
      // The list entries had no `url`, so an engine could read the titles but
      // had nowhere to send anyone — the whole point of giving each case a page.
      ...(c.url ? { url: c.url } : {}),
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
      <Cases items={items.length > 0 ? items : undefined} />
    </>
  );
}
