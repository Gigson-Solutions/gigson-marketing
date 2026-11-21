import type { Metadata } from 'next';

import { SITE_NAME } from '../../../../lib/schema';
import ConsultoriaIso from '../../../../src/components/Pages/ConsultoriaIso/ConsultoriaIso';
import { ISO27001 } from '../../../../src/components/Pages/ConsultoriaIso/content27001';

const ORIGIN = 'https://gigsonsolutions.com';
const CANONICAL = `${ORIGIN}/es/consultoria-iso-27001`;

const TITLE = 'Certificación ISO 27001 para pymes | Gigson Solutions';
const DESCRIPTION =
  'Consultoría ISO 27001 para pymes de 10 a 250 personas. Implantamos controles reales sobre tu operativa, no documentación que nadie usa, y coordinamos la auditoría con la certificadora. Diagnóstico sin coste.';

// Landing de campaña (Google Ads), montada como /es/consultoria-odoo. noindex,
// para no competir en buscadores con la página de servicio /es/iso-27001.
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

export default function ConsultoriaIso27001Page() {
  return <ConsultoriaIso content={ISO27001} />;
}
