import type { MetadataRoute } from 'next';

import { getPostIndex, type PostIndexEntry } from '../lib/posts';
import { CATEGORY_SLUGS } from '../lib/blogCategories';

// Without this the sitemap is baked in at build time (Next defaults to a
// static route for a generator with no dynamic params) — new posts wouldn't
// show up in it until the next deploy.
export const revalidate = 3600;

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
  { en: '/iso-27001', es: '/iso-27001', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/logistics-technology', es: '/tecnologia-logistica', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/retail-ecommerce-technology', es: '/tecnologia-retail-ecommerce', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/construction-technology', es: '/tecnologia-construccion', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/professional-services-technology', es: '/servicios-profesionales', priority: 0.8, changeFrequency: 'monthly' },
  { en: '/cases', es: '/casos', priority: 0.8, changeFrequency: 'monthly' },
  // '/blog' index pages are handled separately in blogIndexEntries() below,
  // so they can carry a real `lastModified` (max post date per locale)
  // instead of a fabricated build-time date.
  { en: '/about', es: '/sobre-nosotros', priority: 0.7, changeFrequency: 'monthly' },
  { en: '/contact', es: '/contacto', priority: 0.7, changeFrequency: 'monthly' },
  { en: '/faqs', es: '/preguntas-frecuentes', priority: 0.6, changeFrequency: 'monthly' },
  { en: '/integrations-odoo', es: '/integraciones-odoo', priority: 0.75, changeFrequency: 'monthly' },
  { en: '/custom-erp', es: '/erp-a-medida', priority: 0.75, changeFrequency: 'monthly' },
  { en: '/project-estimator', es: '/estimador-de-proyecto', priority: 0.75, changeFrequency: 'monthly' },
  { en: '/integrations-holded', es: '/integraciones-holded', priority: 0.5, changeFrequency: 'monthly' },
  { en: '/ai-manifest', es: '/manifiesto-ia', priority: 0.5, changeFrequency: 'monthly' },
  { en: '/policy', es: '/politica', priority: 0.3, changeFrequency: 'yearly' },
  { en: '/notice', es: '/aviso-legal', priority: 0.3, changeFrequency: 'yearly' },
  { en: '/cookies', es: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

/** Absolute URL for a route in one locale. The home route is `/` in both
 * locales, which concatenated naively gives `https://gigsonsolutions.com/es/`
 * — a URL that 308s to `/es`, and that Ahrefs reports as "3XX redirect in
 * sitemap". Every page's canonical omits the trailing slash, so the sitemap
 * has to match it exactly instead of advertising a URL that redirects. */
function absoluteUrl(localePrefix: string, path: string): string {
  return `${ORIGIN}${localePrefix}${path === '/' ? '' : path}`;
}

function makeStaticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap(({ en, es, priority = 0.7, changeFrequency = 'monthly' }) => {
    const enUrl = absoluteUrl('', en);
    const esUrl = absoluteUrl('/es', es);
    const alternates = { languages: { en: enUrl, es: esUrl } };
    return [
      { url: enUrl, alternates, priority, changeFrequency },
      { url: esUrl, alternates, priority, changeFrequency },
    ];
  });
}

/** Most recent `updatedAt` (falling back to `publishedAt`) across a set of
 * posts, for the `/blog` index's own `lastModified` — undefined when there
 * are no posts yet in that locale, so the entry falls back to no date rather
 * than a fabricated one. */
function mostRecentDate(posts: PostIndexEntry[]): Date | undefined {
  const times = posts
    .map((p) => p.updatedAt ?? p.publishedAt)
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

function postEntries(locale: 'es' | 'en', posts: PostIndexEntry[]): MetadataRoute.Sitemap {
  return posts.map((post) => {
    const dateStr = post.updatedAt ?? post.publishedAt;
    return {
      url: locale === 'es' ? `${ORIGIN}/es/blog/${post.slug}` : `${ORIGIN}/blog/${post.slug}`,
      lastModified: dateStr ? new Date(dateStr) : undefined,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    };
  });
}

function blogIndexEntries(esPosts: PostIndexEntry[], enPosts: PostIndexEntry[]): MetadataRoute.Sitemap {
  return [
    { url: `${ORIGIN}/blog`, lastModified: mostRecentDate(enPosts), priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${ORIGIN}/es/blog`, lastModified: mostRecentDate(esPosts), priority: 0.8, changeFrequency: 'weekly' as const },
  ];
}

// 7 categories × 2 locales. Indexable (Option A — hub of content with a
// featured link to the matching service page, see lib/blogCategories.ts),
// not `noindex`: the anti-cannibalization guard is the featured link + the
// "Artículos sobre X" framing, not hiding the page from Google.
function getCategoryEntries(): MetadataRoute.Sitemap {
  return (Object.entries(CATEGORY_SLUGS) as [keyof typeof CATEGORY_SLUGS, { es: string; en: string }][]).flatMap(
    ([, slugs]) => {
      const enUrl = `${ORIGIN}/blog/category/${slugs.en}`;
      const esUrl = `${ORIGIN}/es/blog/categoria/${slugs.es}`;
      return [
        { url: enUrl, alternates: { languages: { en: enUrl, es: esUrl } }, priority: 0.5, changeFrequency: 'weekly' as const },
        { url: esUrl, alternates: { languages: { en: enUrl, es: esUrl } }, priority: 0.5, changeFrequency: 'weekly' as const },
      ];
    },
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each post exists in exactly one locale (`Posts.locale`), so only its own
  // URL is listed — no fabricated alternate for a language it was never
  // published in.
  const [esPosts, enPosts] = await Promise.all([getPostIndex('es'), getPostIndex('en')]);

  return [
    ...makeStaticEntries(),
    ...getCategoryEntries(),
    ...blogIndexEntries(esPosts, enPosts),
    ...postEntries('es', esPosts),
    ...postEntries('en', enPosts),
  ];
}
