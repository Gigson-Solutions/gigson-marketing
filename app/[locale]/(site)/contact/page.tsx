import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Contact from '../../../../src/components/Pages/Contact';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { ORIGIN, buildBreadcrumbSchema, buildOrganization, localizedUrl } from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('contact') as { title: string; description: string };
  const canonicalBase = localizedUrl('/contact', locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalBase,
      languages: {
        en: `${ORIGIN}/contact`,
        es: `${ORIGIN}/es/contacto`,
        'x-default': `${ORIGIN}/contact`,
      },
    },
    openGraph: { type: 'website', title: seo.title, description: seo.description, url: canonicalBase, images: ['/opengraph-image'] },
  };
}

export default async function ContactPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [tOrg, tCrumb, tMenu] = await Promise.all([
    getTranslations({ locale, namespace: 'organization' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
  ]);

  // This page used to declare its own Organization with a different logo path
  // (/img/gigson-solutions-logo.png) and a different email (emmelin@) than the
  // home page's. Both now come from the single node in `lib/schema.ts`.
  const organizationSchema = buildOrganization(tOrg('description'));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('contact'), pathKey: '/contact' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Contact />
    </>
  );
}
