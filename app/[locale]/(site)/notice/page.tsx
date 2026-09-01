import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Notice from '../../../../src/components/Pages/Notice/Notice';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('notice') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/aviso-legal` : `${ORIGIN}/notice`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/notice`,
        es: `${ORIGIN}/es/aviso-legal`,
        'x-default': `${ORIGIN}/notice`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default function NoticePage() {
  return <Notice />;
}
