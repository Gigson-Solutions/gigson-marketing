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
 * The company logo, as one constant because it is declared from two places
 * (`organizationMinimal` and `buildOrganization`) and they had already drifted
 * from the file that exists: both pointed at `/gigson-logo.svg`, which 404s in
 * production — nothing has ever been served from there. Anything resolving the
 * entity's logo (a knowledge panel, an answer card) got an error page.
 *
 * The PNG below is the file the site actually ships, and at 437×122 it clears
 * Google's 112px minimum for `Organization.logo`.
 */
const LOGO_URL = `${ORIGIN}/img/gigson-solutions-logo.png`;

/**
 * Contact details, from the ones already published in the legal notice
 * (`notice.pc_2_3`–`pc_2_7` in `messages/*.json`) — so the structured data and
 * the page a visitor reads can't state different things.
 *
 * `email` was the one that did: this node advertised `hola@gigsonsolutions.com`
 * while the messages, the chatbot prompt (`src/lib/gigson.ts`) and the FAQ all
 * said `info@`. Contradictory contact details inside one domain read as a
 * low-confidence entity, and an engine citing the wrong one is a lost lead.
 */
const CONTACT_EMAIL = 'info@gigsonsolutions.com';
const CONTACT_PHONE = '+34630840225';

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
    logo: LOGO_URL,
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
    logo: LOGO_URL,
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
    // A physical address is one of the strongest signals for disambiguating a
    // company from every other one sharing its name, and it decides whether the
    // entity can answer a "… in Barcelona / in Spain" question at all. Taken
    // verbatim from the registered address in the legal notice.
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C/ Lepant 270',
      postalCode: '08013',
      addressLocality: 'Barcelona',
      addressCountry: 'ES',
    },
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    /**
     * The Anthropic partnership is the company's main differentiator and it
     * existed only as prose — a crawler could read the words on the page but
     * had nothing to attach to the entity. `recognizedBy` is the part that
     * carries the weight: it names who granted the credential, so the claim
     * resolves against Anthropic rather than being self-asserted.
     */
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certified Anthropic Claude Partner',
      credentialCategory: 'Partner certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Anthropic',
        url: 'https://www.anthropic.com',
      },
    },
    // Deliberately just the one profile. `sameAs` is how an engine confirms that
    // the company on this site and the company others write about are the same
    // entity, so every entry has to be a real profile — a guessed Crunchbase or
    // GitHub URL that 404s breaks the confirmation it exists to provide.
    sameAs: ['https://www.linkedin.com/company/gigson-solutions'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      availableLanguage: ['es', 'en'],
    },
  };
}

/** Absolute URL of an author's page. Not in `routing.pathnames`/`StaticPathnames`
 * on purpose — the same reason `/blog/[slug]` isn't: the segment is a slug
 * from Payload (`Authors.slug`), not a static route `localizedUrl` can resolve. */
export function authorUrl(slug: string, locale: string): string {
  const path = locale === 'es' ? `/es/blog/autores/${slug}` : `/blog/authors/${slug}`;
  return `${ORIGIN}${path}`;
}

/**
 * Person schema for an author — emitted inline inside a post's `BlogPosting.author`
 * *and* as the main entity of that author's own page. The `@id`
 * (`${ORIGIN}/#person-<slug>`) is shared between both: that's what tells a
 * crawler they're the same person, not text-matching the name. `sameAs` is
 * only included when a real LinkedIn URL exists on the author's profile —
 * never a placeholder, which would misidentify the entity.
 */
export function buildPersonSchema(
  author: { slug: string; name: string; jobTitle?: string; linkedin?: string; knowsAbout?: string[] },
  locale: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${ORIGIN}/#person-${author.slug}`,
    name: author.name,
    url: authorUrl(author.slug, locale),
    ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
    ...(author.knowsAbout && author.knowsAbout.length > 0 ? { knowsAbout: author.knowsAbout } : {}),
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
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
