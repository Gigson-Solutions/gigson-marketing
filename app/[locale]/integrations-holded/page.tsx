import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Integrations from '../../../src/components/Pages/Integrations/Integrations';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'integrations-holded' });
  const title = t('title');
  const description = t('metadescription');
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/integraciones-holded`
    : `${ORIGIN}/integrations-holded`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/integrations-holded`,
        es: `${ORIGIN}/es/integraciones-holded`,
        'x-default': `${ORIGIN}/integrations-holded`,
      },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default function IntegrationsPage() {
  return <Integrations />;
}
