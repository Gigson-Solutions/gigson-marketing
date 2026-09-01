import { getPayload } from 'payload';
import type { Where } from 'payload';
import { draftMode } from 'next/headers';
import configPromise from '@payload-config';

export type PostCategory =
  | 'agentes-ia'
  | 'integraciones-erp'
  | 'ciberseguridad'
  | 'ingenieria-software'
  | 'consultoria-tecnologica'
  | 'casos-exito'
  | 'sectores';

export type Post = {
  id: string;
  title: string;
  slug: string;
  category?: PostCategory;
  locale?: 'en' | 'es';
  excerpt?: string;
  coverImage?: {
    url?: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url?: string };
      card?: { url?: string };
      hero?: { url?: string };
    };
  };
  publishedAt?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  // Serialized Lexical editor state — rendered via `<RichText>` +
  // `src/components/Blog/richTextConverters.tsx`, not pre-converted HTML.
  content?: unknown;
  // Populated (depth >= 1) or a bare id/null. The same article in the other
  // locale — kept in sync both ways by a Payload hook (collections/Posts.ts).
  localizedVersion?: Post | string | null;
};

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

/** True while viewing a post through Payload's "Preview" button
 * (see `admin.preview` in `collections/Posts.ts` + `app/api/preview/route.ts`).
 * Lets an editor see an unpublished draft with the real page design,
 * without publishing it or writing to the database. */
async function isPreview(): Promise<boolean> {
  try {
    const draft = await draftMode();
    return draft.isEnabled;
  } catch {
    return false;
  }
}

export async function getPosts(locale?: string): Promise<Post[]> {
  try {
    const payload = await getPayloadInstance();
    const preview = await isPreview();

    const conditions: Where[] = [];
    if (!preview) conditions.push({ status: { equals: 'published' } });
    if (locale) conditions.push({ locale: { equals: locale } });

    const where: Where = conditions.length ? { and: conditions } : {};

    const result = await payload.find({
      collection: 'posts',
      where,
      sort: '-publishedAt',
      limit: 50,
      depth: 2,
    });
    return result.docs as unknown as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string, locale?: string): Promise<Post | null> {
  try {
    const payload = await getPayloadInstance();
    const preview = await isPreview();

    const conditions: Where[] = [{ slug: { equals: slug } }];
    if (!preview) conditions.push({ status: { equals: 'published' } });
    if (locale) conditions.push({ locale: { equals: locale } });

    const where: Where = { and: conditions };

    const result = await payload.find({
      collection: 'posts',
      where,
      limit: 1,
      depth: 2,
    });
    return (result.docs[0] as unknown as Post) ?? null;
  } catch {
    return null;
  }
}

/** Posts sharing the same `category` as `post` (excluding itself), for the
 * "Sigue leyendo" block at the end of a post — closes the link loop back
 * into the blog that flat CTA-only posts were missing. Falls back to the
 * most recent posts in the same locale when the post has no category or
 * there aren't enough category matches. */
export async function getRelatedPosts(post: Post, limit = 2): Promise<Post[]> {
  try {
    const payload = await getPayloadInstance();

    const baseConditions: Where[] = [
      { status: { equals: 'published' } },
      { slug: { not_equals: post.slug } },
    ];
    if (post.locale) baseConditions.push({ locale: { equals: post.locale } });

    let docs: Post[] = [];

    if (post.category) {
      const byCategory = await payload.find({
        collection: 'posts',
        where: { and: [...baseConditions, { category: { equals: post.category } }] },
        sort: '-publishedAt',
        limit,
        depth: 2,
      });
      docs = byCategory.docs as unknown as Post[];
    }

    if (docs.length < limit) {
      const fallback = await payload.find({
        collection: 'posts',
        where: { and: baseConditions },
        sort: '-publishedAt',
        limit,
        depth: 2,
      });
      const seen = new Set(docs.map((d) => d.id));
      for (const doc of fallback.docs as unknown as Post[]) {
        if (docs.length >= limit) break;
        if (!seen.has(doc.id)) docs.push(doc);
      }
    }

    return docs.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getPostSlugs(locale?: string): Promise<string[]> {
  try {
    const payload = await getPayloadInstance();
    const conditions: Where[] = [{ status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });

    const where: Where = { and: conditions };

    const result = await payload.find({
      collection: 'posts',
      where,
      select: { slug: true },
      limit: 200,
    });
    return result.docs.map((d) => (d as unknown as { slug: string }).slug);
  } catch {
    return [];
  }
}
