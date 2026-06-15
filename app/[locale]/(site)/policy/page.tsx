import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Policy from '../../../../src/components/Pages/Policy/Policy';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('policy') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/politica` : `${ORIGIN}/policy`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/policy`,
        es: `${ORIGIN}/es/politica`,
        'x-default': `${ORIGIN}/policy`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical },
  };
}

export default function PolicyPage() {
  return <Policy />;
}
