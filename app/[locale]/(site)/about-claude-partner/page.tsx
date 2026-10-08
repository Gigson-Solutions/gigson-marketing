import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ClaudePartner from '../../../../src/components/Pages/ClaudePartner/ClaudePartner';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import {
  ORIGIN,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganization,
  buildServiceSchema,
  faqItemsFrom,
  localizedUrl,
} from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'claudePartner' });
  const seo = t.raw('seo') as { title: string; description: string };
  const canonical = localizedUrl('/about-claude-partner', locale);

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
    openGraph: { type: 'website', title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function ClaudePartnerPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const [t, tOrg, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'claudePartner' }),
    getTranslations({ locale, namespace: 'organization' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);
  const seo = t.raw('seo') as { title: string; description: string };

  const organizationSchema = buildOrganization(tOrg('description'));
  const serviceSchema = buildServiceSchema({
    name: seo.title,
    description: seo.description,
    pathKey: '/about-claude-partner',
    locale,
    serviceType: 'AI Consulting',
  });
  const faqSchema = buildFaqSchema(faqItemsFrom(t.raw('faq')));
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: seo.title, pathKey: '/about-claude-partner' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <ClaudePartner />
    </>
  );
}
