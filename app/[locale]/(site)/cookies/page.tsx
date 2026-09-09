import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Cookies from '../../../../src/components/Pages/Cookies/Cookies';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('cookies') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/cookies` : `${ORIGIN}/cookies`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/cookies`,
        es: `${ORIGIN}/es/cookies`,
        'x-default': `${ORIGIN}/cookies`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default function CookiesPage() {
  return <Cookies />;
}
