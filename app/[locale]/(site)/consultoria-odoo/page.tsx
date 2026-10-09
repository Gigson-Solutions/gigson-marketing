import type { Metadata } from 'next';

import { SITE_NAME } from '../../../../lib/schema';
import ConsultoriaOdoo from '../../../../src/components/Pages/ConsultoriaOdoo/ConsultoriaOdoo';

const ORIGIN = 'https://gigsonsolutions.com';
const CANONICAL = `${ORIGIN}/es/consultoria-odoo`;

const TITLE = 'Consultoría e implantación de Odoo | Gigson Solutions';
const DESCRIPTION =
  'Partner oficial de Odoo en España. Implantamos Odoo desde cero, migramos desde Holded y otros ERP y revisamos, rescatamos y actualizamos tu Odoo actual. Diagnóstico sin coste.';

// Landing de campaña (Google Ads). Vive en el route group (site) para usar el
// header y el footer de la web. noindex, para no competir en buscadores con
// /es/integraciones-odoo.
export function generateMetadata(): Metadata {
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    robots: { index: false, follow: false },
    alternates: { canonical: CANONICAL },
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: 'es_ES',
      title: TITLE,
      description: DESCRIPTION,
      url: CANONICAL,
      images: ['/opengraph-image'],
    },
  };
}

export default function ConsultoriaOdooPage() {
  return <ConsultoriaOdoo />;
}
