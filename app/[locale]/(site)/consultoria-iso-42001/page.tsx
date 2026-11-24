import type { Metadata } from 'next';

import { SITE_NAME } from '../../../../lib/schema';
import ConsultoriaIso from '../../../../src/components/Pages/ConsultoriaIso/ConsultoriaIso';
import { ISO42001 } from '../../../../src/components/Pages/ConsultoriaIso/content42001';

const ORIGIN = 'https://gigsonsolutions.com';
const CANONICAL = `${ORIGIN}/es/consultoria-iso-42001`;

const TITLE = 'Certificación ISO 42001 de gestión de la IA | Gigson Solutions';
const DESCRIPTION =
  'Consultoría ISO 42001 para empresas que usan o desarrollan IA: inventario de sistemas, riesgos, política de IA y preparación para la Ley de IA europea, de la mano de un equipo que construye agentes de IA. Diagnóstico sin coste.';

// Landing de campaña (Google Ads), montada como /es/consultoria-odoo. noindex,
// para no competir en buscadores con la página de servicio /es/iso-42001.
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

export default function ConsultoriaIso42001Page() {
  return <ConsultoriaIso content={ISO42001} />;
}
