// Pure-ish utility (one value import, `getPathname`, which itself has no
// server-only dependencies) — safe to import from the client-side
// `BlogList.tsx`. Do not import `lib/posts.ts` as a value here; see the
// note in `lib/blogCovers.ts` for why.
import { getPathname } from '../i18n/navigation';
import type { AppPathnames } from '../i18n/routing';
import type { PostCategory } from './posts';

// `AppPathnames` minus the dynamic pathnames — same pattern Navbar/Footer/etc.
// use locally (`StaticPathnames` in `i18n/routing.ts` doesn't exist on this
// branch; that's PR "seo/08-routing-prereq", independent of this one).
type ServicePathname = Exclude<AppPathnames, '/blog/[slug]' | '/blog/category/[category]'>;

/** URL slug per locale for each category archive — independent from the
 * Spanish-only `PostCategory` value stored in Payload, so the English
 * archive doesn't read `/blog/category/agentes-ia`. */
export const CATEGORY_SLUGS: Record<PostCategory, { es: string; en: string }> = {
  'agentes-ia': { es: 'agentes-ia', en: 'ai-agents' },
  'integraciones-erp': { es: 'integraciones-erp', en: 'erp-integrations' },
  ciberseguridad: { es: 'ciberseguridad', en: 'cybersecurity' },
  'ingenieria-software': { es: 'ingenieria-software', en: 'software-engineering' },
  'consultoria-tecnologica': { es: 'consultoria-tecnologica', en: 'technology-consulting' },
  'casos-exito': { es: 'casos-exito', en: 'case-studies' },
  sectores: { es: 'sectores', en: 'sectors' },
};

/**
 * The service page each category archive should point readers toward with a
 * featured link — the head commercial term always stays on that page, the
 * archive only ever targets the informational query (anti-cannibalization
 * rule already applied to individual posts, see the plan doc).
 *
 * Only set for the 5 categories that share a topic with an existing
 * commercial page (`agentes-ia`, `ciberseguridad`, `ingenieria-software`,
 * `consultoria-tecnologica`, `casos-exito`). `integraciones-erp` and
 * `sectores` don't map cleanly onto one page (Odoo vs Holded vs custom ERP;
 * four different sector pages) — no featured link rather than a wrong guess.
 */
export const CATEGORY_SERVICE_PAGE: Partial<Record<PostCategory, ServicePathname>> = {
  'agentes-ia': '/ai-agents',
  ciberseguridad: '/cybersecurity',
  'ingenieria-software': '/software-engineering',
  'consultoria-tecnologica': '/technology-consulting',
  'casos-exito': '/cases',
};

/** `menu.*` translation key for the label of each category's linked service
 * page (see `CATEGORY_SERVICE_PAGE`) — kept alongside it so both stay in sync. */
export const CATEGORY_SERVICE_LABEL_KEY: Partial<Record<PostCategory, string>> = {
  'agentes-ia': 'ai_agents',
  ciberseguridad: 'cibersecurity',
  'ingenieria-software': 'software',
  'consultoria-tecnologica': 'tech_consulting',
  'casos-exito': 'cases',
};

export function categorySlug(category: PostCategory, locale: string): string {
  const entry = CATEGORY_SLUGS[category];
  return locale === 'es' ? entry.es : entry.en;
}

export function categoryFromSlug(slug: string, locale: string): PostCategory | undefined {
  const entries = Object.entries(CATEGORY_SLUGS) as [PostCategory, { es: string; en: string }][];
  return entries.find(([, s]) => (locale === 'es' ? s.es : s.en) === slug)?.[0];
}

/** Localized URL for a category archive page. */
export function categoryHref(category: PostCategory, locale: string): string {
  return getPathname({
    locale,
    href: { pathname: '/blog/category/[category]', params: { category: categorySlug(category, locale) } },
  });
}
