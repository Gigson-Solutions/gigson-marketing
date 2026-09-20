import { routing, type StaticPathnames } from '../i18n/routing';
import { coverImagePath } from './blogCovers';
import { COMPANY } from './company';
// Type-only: `lib/posts.ts` imports Payload and the Postgres adapter at
// module top, and this module must stay reachable from client components
// (same precaution `lib/blogCovers.ts` already documents).
import type { Post } from './posts';

/**
 * Reexportado desde `lib/company.ts` para que los ~20 módulos que ya importan
 * `ORIGIN` de aquí sigan funcionando sin tocarlos, y el dominio viva en un
 * único sitio.
 */
export const ORIGIN = COMPANY.site.origin;

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

/** Stable node id for the entity logo, reused by `image` without repeating the URL. */
const LOGO_ID = `${ORIGIN}/#logo`;

/**
 * The full Organization node. Emit it on pages that are *about* the company
 * (home, about, contact, the Claude partner page); everywhere else use
 * `organizationRef`. `description` is localized, so it comes from the caller.
 *
 * The identity block (`legalName`, `alternateName`, `taxID`/`vatID`,
 * `identifier`, `address`) is what ties the `Gigson Solutions` brand to
 * Awesomely SL. Institutional citations — company registries, `.gob.es`
 * directories, chambers of commerce, the Odoo partner listing — all use the
 * registered name, so without these fields none of that authority reaches this
 * entity: to a crawler they were simply two unrelated companies.
 *
 * Deliberately absent: `foundingDate`. Five different dates are in
 * circulation (schema said 2021, the registry says 2025-05-30, Clutch says
 * 2022 and "over 8 years", the site says "11 años") because the team predates
 * the company. On a node that declares `legalName` and `vatID` the property
 * describes the *company*, so anything but the registry date is wrong — and
 * the registry date understates the team, which is the reason none of the
 * five was picked. `Organization` has no required properties; saying nothing
 * beats publishing a date that a company-registry lookup refutes. The team's
 * track record stays as prose on `/about`, where it is attributed to the
 * people and not to the entity.
 */
export function buildOrganization(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,

    name: COMPANY.brandName,
    // Tells a crawler outright that all three strings denote one entity.
    alternateName: [COMPANY.shortName, COMPANY.legalNameShort],
    legalName: COMPANY.legalName,
    url: ORIGIN,
    description,

    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      // Both spellings: some consumers read `url`, others `contentUrl`.
      url: `${ORIGIN}${COMPANY.logo.path}`,
      contentUrl: `${ORIGIN}${COMPANY.logo.path}`,
      width: COMPANY.logo.width,
      height: COMPANY.logo.height,
      caption: COMPANY.brandName,
    },
    image: { '@id': LOGO_ID },

    // `vatID` carries the national prefix, `taxID` doesn't; `iso6523Code`
    // is the machine-readable form of the same fact (ICD 9920 = AEAT).
    taxID: COMPANY.taxId,
    vatID: COMPANY.vatId,
    iso6523Code: COMPANY.iso6523,
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'EUID',
        name: 'Identificador Único Europeo (BRIS)',
        value: COMPANY.euid,
      },
      ...COMPANY.cnae.map((code) => ({
        '@type': 'PropertyValue',
        propertyID: 'CNAE-2009',
        name: 'CNAE',
        value: code,
      })),
    ],

    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.streetAddress,
      addressLocality: COMPANY.address.locality,
      addressRegion: COMPANY.address.region,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.country,
    },

    telephone: COMPANY.phone,
    email: COMPANY.email.general,
    contactPoint: {
      '@type': 'ContactPoint',
      // 'customer service' is a value from Google's list; the previous
      // 'customer support' is not.
      contactType: 'customer service',
      email: COMPANY.email.general,
      telephone: COMPANY.phone,
      availableLanguage: ['es', 'en'],
      areaServed: 'ES',
    },

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
    sameAs: [...COMPANY.profiles],
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

/**
 * A free-to-use tool hosted on the site, as opposed to a service we sell.
 * `WebApplication` is what makes the estimator read as a citable tool rather
 * than another service page — `Service` describes something you buy.
 *
 * `isAccessibleForFree` is a required judgement, not a default: the estimator
 * keeps its result behind a form and a booked call, so it is declared `false`.
 * Only pass `true` for a tool that yields something useful without a gate.
 */
export function buildWebApplicationSchema({
  name,
  description,
  pathKey,
  locale,
  isAccessibleForFree,
}: {
  name: string;
  description: string;
  pathKey: StaticPathnames;
  locale: string;
  isAccessibleForFree: boolean;
}) {
  const url = localizedUrl(pathKey, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: [...routing.locales],
    isAccessibleForFree,
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
