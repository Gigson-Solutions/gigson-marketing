import { routing, type StaticPathnames } from '../i18n/routing';
import { coverImagePath } from './blogCovers';
// Type-only: `lib/posts.ts` imports Payload and the Postgres adapter at
// module top, and this module must stay reachable from client components
// (same precaution `lib/blogCovers.ts` already documents).
import type { Post } from './posts';

export const ORIGIN = 'https://gigsonsolutions.com';

/**
 * Stable node id for the one Organization entity. Every schema that refers to
 * the company points here instead of inlining another copy — four pages used
 * to emit four disjoint `Organization` nodes (different logo, email, and a
 * `sameAs` that existed on only one of them), which reads as four unrelated
 * companies rather than one.
 */
export const ORGANIZATION_ID = `${ORIGIN}/#organization`;

/** Reference to the Organization above, for `provider`/`publisher` slots. */
export const organizationRef = { '@id': ORGANIZATION_ID } as const;

/**
 * Minimal Organization node (name + logo) carrying the same `@id` as the full
 * node from `buildOrganization()`. For pages that need `publisher.name` to
 * satisfy Google's Article/BlogPosting requirements (blog posts, the blog
 * index) but aren't themselves "about" the company — the shared `@id` is what
 * tells a crawler this is the same entity, without re-declaring the
 * description/foundingDate/etc. on every post.
 */
export function organizationMinimal() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Gigson Solutions',
    logo: `${ORIGIN}/gigson-logo.svg`,
  };
}

type Locale = (typeof routing.locales)[number];

/**
 * Absolute URL for a route in a given locale, resolved from the single ES↔EN
 * map in `i18n/routing.ts`. Ten pages used to hardcode the English path into
 * their `Service.url`, so `/es/tecnologia-logistica` advertised itself as
 * `/logistics-technology`.
 */
export function localizedUrl(pathKey: StaticPathnames, locale: string): string {
  const entry = routing.pathnames[pathKey] as string | Record<Locale, string>;
  const path = typeof entry === 'string' ? entry : entry[locale as Locale] ?? entry.en;
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return path === '/' ? `${ORIGIN}${prefix || '/'}` : `${ORIGIN}${prefix}${path}`;
}

/**
 * The full Organization node. Emit it on pages that are *about* the company
 * (home, about, contact, the Claude partner page); everywhere else use
 * `organizationRef`. `description` is localized, so it comes from the caller.
 */
export function buildOrganization(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Gigson Solutions',
    url: ORIGIN,
    logo: `${ORIGIN}/gigson-logo.svg`,
    description,
    foundingDate: '2021',
    areaServed: ['ES', 'MX', 'AR', 'PE'],
    knowsAbout: [
      'Artificial Intelligence',
      'Claude AI',
      'Anthropic',
      'AI Agents',
      'Systems Integration',
      'Software Engineering',
      'Cybersecurity',
    ],
    sameAs: ['https://www.linkedin.com/company/gigson-solutions'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hola@gigsonsolutions.com',
    },
  };
}

export function buildServiceSchema({
  name,
  description,
  pathKey,
  locale,
  serviceType,
  areaServed = 'ES',
}: {
  name: string;
  description: string;
  pathKey: StaticPathnames;
  locale: string;
  serviceType: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: localizedUrl(pathKey, locale),
    serviceType,
    areaServed,
    provider: organizationRef,
  };
}

export type FaqItem = { question: string; answer: string };

/** Returns null for an empty list so callers can render conditionally.
 * `id` is optional and additive (existing callers are unaffected) — the blog
 * post page passes one so its `FAQPage` can be addressed as
 * `${postUrl(post)}#faq` and marked `isPartOf` the article. */
export function buildFaqSchema(items: FaqItem[] | undefined, id?: string) {
  if (!items || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(id ? { '@id': id } : {}),
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/** Absolute canonical URL for a post, from its own `locale`/`slug`. Lives here
 * (not in the post page component) because the blog index, the author page
 * and the category archives all need it too. */
export function postUrl(post: Pick<Post, 'locale' | 'slug'>): string {
  return post.locale === 'es' ? `${ORIGIN}/es/blog/${post.slug}` : `${ORIGIN}/blog/${post.slug}`;
}

/** Absolute URL of a post's picture. An uploaded cover wins; otherwise this is
 * the rasterised version of the same generated composition the page renders,
 * so social previews and the Article/BlogPosting schema always have a real
 * image. */
export function articleImage(post: Pick<Post, 'coverImage' | 'slug' | 'category'>): string {
  const uploaded = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;
  if (!uploaded) return `${ORIGIN}${coverImagePath(post)}`;
  // Payload returns an absolute URL on Vercel Blob but a relative /api/media
  // path on local disk storage, so absolutise defensively.
  return uploaded.startsWith('http') ? uploaded : `${ORIGIN}${uploaded}`;
}

/**
 * Reads `<namespace>.faq.items` the way the 12 service namespaces in
 * `messages/*.json` already store it, so the visual `ServiceFaq` and the
 * schema can never drift apart.
 */
export function faqItemsFrom(raw: unknown): FaqItem[] {
  return (raw as { items?: FaqItem[] } | undefined)?.items ?? [];
}

/**
 * Trail items address a route either by its key in `routing.pathnames` or, for
 * pages whose path isn't in that map (a blog post, whose slug comes from
 * Payload), by an absolute URL.
 */
export type BreadcrumbItem =
  | { name: string; pathKey: StaticPathnames }
  | { name: string; url: string };

export function buildBreadcrumbSchema(items: BreadcrumbItem[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: 'url' in item ? item.url : localizedUrl(item.pathKey, locale),
    })),
  };
}

/**
 * Short label for a breadcrumb trail, taken from the page's SEO title by
 * dropping the brand suffix ("… | Gigson Solutions", "… · Gigson Solutions").
 * Reuses copy that already exists in `messages/*.json` instead of adding a
 * parallel set of breadcrumb strings that would drift from the titles.
 */
export function breadcrumbLabel(title: string): string {
  return title.split(/[|·]/)[0].trim();
}
