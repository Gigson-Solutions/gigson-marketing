import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import ProjectEstimator from '../../../../src/components/Pages/ProjectEstimator/ProjectEstimator';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import {
  ORIGIN,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  breadcrumbLabel,
} from '../../../../lib/schema';


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
    openGraph: { type: 'website', title, description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function ProjectEstimatorPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'projectEstimator' });
  const title = t('seo.title');
  const description = t('seo.description');

  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' });

  // Es una herramienta alojada aquí, no un servicio que se vende, así que
  // `WebApplication` en lugar de `Service`. `isAccessibleForFree: false`
  // porque el presupuesto está tras el formulario de email y las horas tras
  // una reunión reservada — declararlo gratuito sería falso.
  const appSchema = buildWebApplicationSchema({
    name: title,
    description,
    pathKey: '/project-estimator',
    locale,
    isAccessibleForFree: false,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: breadcrumbLabel(title), pathKey: '/project-estimator' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ProjectEstimator />
    </>
  );
}
