import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Services from '../../../src/components/Services/Services';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('services') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/servicios` : `${ORIGIN}/services`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: { en: `${ORIGIN}/services`, es: `${ORIGIN}/es/servicios`, 'x-default': `${ORIGIN}/services` },
    },
    openGraph: { title: seo.title, description: seo.description, url: canonical },
  };
}

export default function ServicesPage() {
  return <Services />;
}
