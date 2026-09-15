import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import AiManifest from '../../../../src/components/Pages/AiManifest/AiManifest';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('ai_manifest') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/manifiesto-ia` : `${ORIGIN}/ai-manifest`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/ai-manifest`,
        es: `${ORIGIN}/es/manifiesto-ia`,
        'x-default': `${ORIGIN}/ai-manifest`,
      },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default function AiManifestPage() {
  return <AiManifest />;
}
