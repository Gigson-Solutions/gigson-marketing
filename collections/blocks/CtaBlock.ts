import type { Block } from 'payload';

/**
 * Reusable "CTA to a service page" block for blog post content.
 * `href` is a `select` of known internal routes (not free text) so authors
 * can't paste a broken URL or one missing the `/es` locale prefix — the
 * JSX converter (src/components/Blog/richTextConverters.tsx) resolves the
 * actual localized href via next-intl's `Link`.
 */
export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Frase corta que invita a la acción, ej. "¿Quieres ver cómo lo hacemos?"' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Texto del botón, ej. "Habla con un experto en Holded"' },
    },
    {
      name: 'href',
      type: 'select',
      required: true,
      options: [
        { label: 'Integraciones Holded', value: '/integrations-holded' },
        { label: 'Agentes de IA', value: '/ai-agents' },
        { label: 'CTO as a Service', value: '/cto-as-service' },
        { label: 'Consultoría tecnológica', value: '/technology-consulting' },
        { label: 'Ingeniería de software', value: '/software-engineering' },
        { label: 'Ciberseguridad', value: '/cybersecurity' },
        { label: 'Certificación ISO 27001', value: '/iso-27001-certification' },
        { label: 'Logística', value: '/logistics-technology' },
        { label: 'Retail / eCommerce', value: '/retail-ecommerce-technology' },
        { label: 'Construcción', value: '/construction-technology' },
        { label: 'Casos de éxito', value: '/cases' },
        { label: 'Contacto', value: '/contact' },
      ],
    },
  ],
};
