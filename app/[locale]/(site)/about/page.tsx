import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import AboutHero from '../../../../src/components/About/AboutHero';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { ORIGIN, buildBreadcrumbSchema, buildOrganization, localizedUrl } from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('about') as { title: string; description: string };
  const canonical = localizedUrl('/about', locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/about`, es: `${ORIGIN}/es/sobre-nosotros`, 'x-default': `${ORIGIN}/about` },
    },
    openGraph: { type: 'website', title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function AboutPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [tOrg, tCrumb, tMenu] = await Promise.all([
    getTranslations({ locale, namespace: 'organization' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
  ]);

  const organizationSchema = buildOrganization(tOrg('description'));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('about'), pathKey: '/about' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <AboutHero />
    </>
  );
}
