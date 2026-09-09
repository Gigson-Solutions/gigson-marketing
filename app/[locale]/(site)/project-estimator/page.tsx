import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ProjectEstimator from '../../../../src/components/Pages/ProjectEstimator/ProjectEstimator';

const ORIGIN = 'https://gigsonsolutions.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'projectEstimator' });
  const title = t('seo.title');
  const description = t('seo.description');
  const canonical = locale === 'es' ? `${ORIGIN}/es/estimador-de-proyecto` : `${ORIGIN}/project-estimator`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/project-estimator`,
        es: `${ORIGIN}/es/estimador-de-proyecto`,
        'x-default': `${ORIGIN}/project-estimator`,
      },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function ProjectEstimatorPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'projectEstimator' });
  const title = t('seo.title');
  const description = t('seo.description');
  const serviceUrl = locale === 'es' ? '/es/estimador-de-proyecto' : '/project-estimator';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${ORIGIN}${serviceUrl}`,
    serviceType: 'Software Project Estimation',
    areaServed: 'ES',
    provider: { '@type': 'Organization', name: 'Gigson Solutions', url: ORIGIN },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ProjectEstimator />
    </>
  );
}
