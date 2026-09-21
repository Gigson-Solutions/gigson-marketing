import { getPayload } from 'payload';
import type { Where } from 'payload';
import configPromise from '@payload-config';

/** Array fields come back from Payload as `{ id, text }` rows, in `_order`. */
type TextRow = { text: string };

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  challenge: string;
  solution?: string;
  features?: TextRow[];
  results?: TextRow[];
  tools?: TextRow[];
  tags?: TextRow[];
  need?: TextRow[];
  coverImage?: {
    url?: string;
    alt?: string;
    sizes?: { thumbnail?: { url?: string }; card?: { url?: string } };
  };
  locale?: 'en' | 'es';
  publishedAt?: string;
  updatedAt?: string;
  /** Populated (depth >= 1) or a bare id/null. The same case in the other
   * locale — kept in sync both ways by a hook (collections/Cases.ts). */
  localizedVersion?: CaseStudy | string | null;
};

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

/** Flattens `[{ text: 'a' }, { text: 'b' }]` to `['a', 'b']`, which is what
 * every consumer actually wants — and what the message-file shape these cases
 * were migrated from already used. */
export function textRows(rows?: TextRow[]): string[] {
  return (rows ?? []).map((r) => r.text).filter(Boolean);
}

/** Published cases in one locale, newest first. Every query in this module
 * swallows its error and returns an empty result: the case pages must not take
 * the site down when Postgres is unreachable, the same contract `lib/posts.ts`
 * and `lib/authors.ts` already follow (and what lets `npm run build` succeed
 * without a database). */
export async function getCases(locale?: string): Promise<CaseStudy[]> {
  try {
    const payload = await getPayloadInstance();
    const conditions: Where[] = [{ status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });
    const result = await payload.find({
      collection: 'cases',
      where: { and: conditions },
      sort: '-publishedAt',
      limit: 100,
      depth: 1,
    });
    return result.docs as unknown as CaseStudy[];
  } catch {
    return [];
  }
}

export async function getCaseBySlug(slug: string, locale?: string): Promise<CaseStudy | null> {
  try {
    const payload = await getPayloadInstance();
    const conditions: Where[] = [{ slug: { equals: slug } }, { status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });
    const result = await payload.find({
      collection: 'cases',
      where: { and: conditions },
      limit: 1,
      depth: 1,
    });
    return (result.docs[0] as unknown as CaseStudy) ?? null;
  } catch {
    return null;
  }
}

export type CaseIndexEntry = { slug: string; updatedAt?: string; publishedAt?: string };

/** Slug + dates only, for `generateStaticParams` and the sitemap's `lastmod`.
 * Mirrors `getPostIndex` in `lib/posts.ts`. */
export async function getCaseIndex(locale?: string): Promise<CaseIndexEntry[]> {
  try {
    const payload = await getPayloadInstance();
    const conditions: Where[] = [{ status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });
    const result = await payload.find({
      collection: 'cases',
      where: { and: conditions },
      select: { slug: true, updatedAt: true, publishedAt: true },
      limit: 200,
    });
    return result.docs as unknown as CaseIndexEntry[];
  } catch {
    return [];
  }
}
