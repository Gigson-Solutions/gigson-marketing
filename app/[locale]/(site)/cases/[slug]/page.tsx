import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CaseDetail from '../../../../../src/components/Pages/Cases/CaseDetail';
import JsonLd from '../../../../../src/shared/ui/JsonLd';
import { getCaseBySlug, getCaseIndex, textRows, type CaseStudy } from '../../../../../lib/cases';
import {
  buildBreadcrumbSchema,
  caseUrl,
  organizationRef,
} from '../../../../../lib/schema';

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string; slug: string }> };

/** hreflang alternates for a case. Same rule as a blog post
 * (`app/[locale]/(site)/blog/[slug]/page.tsx#postLanguages`): `x-default`
 * resolves to the EN URL of the pair when one exists, since EN is the site's
 * default locale, and only falls back to this case's own canonical when there
 * is no EN sibling — an `x-default` pointing at a URL that 404s is worse than
 * none. */
function caseLanguages(caseStudy: CaseStudy): Record<string, string> {
  const canonical = caseUrl(caseStudy);
  const sibling =
    caseStudy.localizedVersion && typeof caseStudy.localizedVersion === 'object'
      ? caseStudy.localizedVersion
      : null;

  if (caseStudy.locale === 'en') {
    const languages: Record<string, string> = { 'x-default': canonical, en: canonical };
    if (sibling?.locale && sibling.slug) languages[sibling.locale] = caseUrl(sibling);
    return languages;
  }

  const enUrl = sibling?.locale === 'en' && sibling.slug ? caseUrl(sibling) : null;
  return enUrl
    ? { 'x-default': enUrl, en: enUrl, es: canonical }
    : { 'x-default': canonical, es: canonical };
}

export async function generateStaticParams() {
  const [es, en] = await Promise.all([getCaseIndex('es'), getCaseIndex('en')]);
  return [
    ...es.map(({ slug }) => ({ locale: 'es', slug })),
    ...en.map(({ slug }) => ({ locale: 'en', slug })),
  ];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  // Each case exists in exactly one locale (`Cases.locale`), so filtering here
  // makes a request for the wrong locale 404 rather than rendering the same
  // document under two URLs with contradictory alternates.
  const caseStudy = await getCaseBySlug(slug, locale);
  if (!caseStudy) return {};

  const canonical = caseUrl(caseStudy);
  const description = caseStudy.challenge.slice(0, 300);

  return {
    title: `${caseStudy.title} | Gigson Solutions`,
    description,
    alternates: { canonical, languages: caseLanguages(caseStudy) },
    openGraph: { type: 'article', title: caseStudy.title, description, url: canonical },
  };
}

export default async function CasePage(props: Props) {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  const caseStudy = await getCaseBySlug(slug, locale);
  if (!caseStudy) notFound();

  const [tCrumb, tMenu] = await Promise.all([
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
  ]);

  const results = textRows(caseStudy.results);
  const tools = textRows(caseStudy.tools);

  /**
   * `Article` rather than a bare `CreativeWork`: it is the type engines
   * actually recognise for a written piece, and it carries the `about`/
   * `mentions` slots that let the named systems (Odoo, Holded, HubSpot…)
   * attach to the case as entities instead of sitting in prose. `abstract`
   * carries the measurable result, which is the sentence worth quoting.
   */
  const caseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.challenge,
    url: caseUrl(caseStudy),
    inLanguage: caseStudy.locale ?? locale,
    author: organizationRef,
    publisher: organizationRef,
    ...(caseStudy.publishedAt ? { datePublished: caseStudy.publishedAt } : {}),
    ...(caseStudy.updatedAt ? { dateModified: caseStudy.updatedAt } : {}),
    ...(results.length > 0 ? { abstract: results.join(' ') } : {}),
    ...(tools.length > 0 ? { mentions: tools.map((name) => ({ '@type': 'Thing', name })) } : {}),
  };

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('cases'), pathKey: '/cases' },
      { name: caseStudy.title, url: caseUrl(caseStudy) },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={caseSchema} />
      <JsonLd data={breadcrumbSchema} />
      <CaseDetail caseStudy={caseStudy} locale={locale} />
    </>
  );
}
