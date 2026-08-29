import type { MetadataRoute } from 'next';

import { getPostSlugs } from '../lib/posts';

const ORIGIN = 'https://gigsonsolutions.com';

type RouteConfig = {
  en: string;
  es: string;
  priority?: number;
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
};

const STATIC_ROUTES: RouteConfig[] = [
  { en: '/', es: '/', priority: 1.0, changeFrequency: 'weekly' },
  { en: '/ai-agents', es: '/agentes-ia', priority: 0.9, changeFrequency: 'monthly' },
  { en: '/cto-as-service', es: '/cto-as-service', priority: 0.9, changeFrequency: 'monthly' },
  { en: '/about-claude-partner', es: '/sobre-claude-partner', priority: 0.85, changeFrequency: 'monthly' },
  { en: '/technology-consulting', es: '/consultoria-tecnologica', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/software-engineering', es: '/ingenieria-software', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/cybersecurity', es: '/ciberseguridad', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/logistics-technology', es: '/tecnologia-logistica', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/retail-ecommerce-technology', es: '/tecnologia-retail-ecommerce', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/construction-technology', es: '/tecnologia-construccion', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/professional-services-technology', es: '/servicios-profesionales', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/cases', es: '/casos', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/blog', es: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { en: '/about', es: '/sobre-nosotros', priority: 0.7, changeFrequency: 'monthly' },
  { en: '/contact', es: '/contacto', priority: 0.7, changeFrequency: 'monthly' },
  { en: '/faqs', es: '/preguntas-frecuentes', priority: 0.6, changeFrequency: 'monthly' },
  { en: '/iso-27001-certification', es: '/certificacion-iso-27001', priority: 0.6, changeFrequency: 'monthly' },
  { en: '/integrations-odoo', es: '/integraciones-odoo', priority: 0.75, changeFrequency: 'monthly' },
  { en: '/custom-erp', es: '/erp-a-medida', priority: 0.75, changeFrequency: 'monthly' },
  { en: '/integrations-holded', es: '/integraciones-holded', priority: 0.5, changeFrequency: 'monthly' },
  { en: '/ai-manifest', es: '/manifiesto-ia', priority: 0.5, changeFrequency: 'monthly' },
  { en: '/policy', es: '/politica', priority: 0.3, changeFrequency: 'yearly' },
  { en: '/notice', es: '/aviso-legal', priority: 0.3, changeFrequency: 'yearly' },
  { en: '/cookies', es: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

function makeStaticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap(({ en, es, priority = 0.7, changeFrequency = 'monthly' }) => {
    const enUrl = `${ORIGIN}${en}`;
    const esUrl = `${ORIGIN}/es${es}`;
    const alternates = { languages: { en: enUrl, es: esUrl } };
    return [
      { url: enUrl, alternates, priority, changeFrequency },
      { url: esUrl, alternates, priority, changeFrequency },
    ];
  });
}

async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Each post exists in exactly one locale (`Posts.locale`), so only its
    // real URL is listed — no fabricated alternate for a language it was
    // never published in.
    const [esSlugs, enSlugs] = await Promise.all([getPostSlugs('es'), getPostSlugs('en')]);
    return [
      ...esSlugs.map((slug) => ({
        url: `${ORIGIN}/es/blog/${slug}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
      })),
      ...enSlugs.map((slug) => ({
        url: `${ORIGIN}/blog/${slug}`,
        priority: 0.7,
        changeFrequency: 'monthly' as const,
      })),
    ];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries = await getBlogEntries();
  return [...makeStaticEntries(), ...blogEntries];
}
