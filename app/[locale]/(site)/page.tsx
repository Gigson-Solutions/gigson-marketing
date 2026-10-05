import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Home from '../../../src/components/Home/Home';
import JsonLd from '../../../src/shared/ui/JsonLd';
import { ORIGIN, buildOrganization, localizedUrl } from '../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'home' });
  const canonical = localizedUrl('/', locale);

  return {
    title: t('title'),
    description: t('metadescription'),
    alternates: {
      canonical,
      languages: {
        en: ORIGIN,
        es: `${ORIGIN}/es`,
        'x-default': ORIGIN,
      },
    },
    openGraph: { type: 'website', title: t('title'), description: t('metadescription'), url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function HomePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const tOrg = await getTranslations({ locale, namespace: 'organization' });

  // The canonical Organization node for the whole site. Other pages reference
  // it by `@id` (see `lib/schema.ts`) rather than emitting their own copy.
  const organizationSchema = buildOrganization(tOrg('description'));

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gigson Solutions',
    url: ORIGIN,
    publisher: { '@id': organizationSchema['@id'] },
    // No `potentialAction`/`SearchAction`: it used to advertise
    // `/blog?q={search_term_string}`, but the blog listing reads no `q` param —
    // there is no site search to point Google at.
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <Home />
    </>
  );
}
