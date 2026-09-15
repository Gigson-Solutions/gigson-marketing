// Import the catalogue directly, never through `design-system/shapes/index.ts`:
// the barrel re-exports `Shape2D`, which reaches `useDrawOn` and its top-level
// `gsap.registerPlugin(...)`. That side effect cannot be tree-shaken, and GSAP
// is not in the blog bundle today.
import { COVER_BY_ID, COVERS, type Cover, type CoverId } from '../src/design-system/shapes/covers';
// Type-only: `lib/posts.ts` imports Payload and the Postgres adapter at module
// top, and this module is reachable from client components.
import type { PostCategory } from './posts';

/**
 * Which generated composition belongs to a post.
 *
 * The design system owns the compositions and must not know the blog's slugs,
 * so the binding lives here. Resolution is three tiers, most specific first.
 */

/** Tier 1 — editorial choice. Both locales of an article are listed on purpose:
 *  it is the same article, and a reader switching language should recognise it. */
const COVER_BY_SLUG: Record<string, CoverId> = {
  'agentes-ia-conectados-erp-holded-odoo': 'agentes',
  'ai-agents-connected-to-your-erp': 'agentes',
  'automatiza-tu-holded-con-ia': 'automatizar',
  'automate-holded-with-ai': 'automatizar',
};

/** Tier 2 — the 7 categories collapsed onto 4 covers, so a new post is filed
 *  with a picture that agrees with its pillar, and its translation gets the
 *  same one for free. Exhaustive by construction: adding a category to
 *  `collections/Posts.ts` without a cover here is a type error. */
const COVER_BY_CATEGORY: Record<PostCategory, CoverId> = {
  'agentes-ia': 'agentes',
  'integraciones-erp': 'automatizar',
  'ingenieria-software': 'automatizar',
  ciberseguridad: 'senal',
  'casos-exito': 'senal',
  'consultoria-tecnologica': 'conocimiento',
  sectores: 'conocimiento',
};

/** Tier 3 — FNV-1a. Integer-only, so Node and the browser agree exactly and the
 *  prerendered HTML matches the hydrated tree. Nothing random, nothing dated. */
function bucket(seed: string, count: number): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return (hash >>> 0) % count;
}

type CoverSubject = { slug: string; category?: PostCategory };

export function resolveCoverId({ slug, category }: CoverSubject): CoverId {
  return COVER_BY_SLUG[slug] ?? (category && COVER_BY_CATEGORY[category]) ?? COVERS[bucket(slug, COVERS.length)].id;
}

export function resolveCover(subject: CoverSubject): Cover {
  return COVER_BY_ID[resolveCoverId(subject)];
}

/** Root-relative path to the committed raster of the same cover. Deliberately a
 *  path and not a URL: this module lands in the client bundle, so it must not
 *  depend on `lib/schema.ts`. Callers needing an absolute URL prepend ORIGIN. */
export function coverImagePath(subject: CoverSubject): string {
  return `/img/blog-covers/${resolveCoverId(subject)}.png`;
}
