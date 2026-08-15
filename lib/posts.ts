import { getPayload } from 'payload';
import type { Where } from 'payload';
import { draftMode } from 'next/headers';
import configPromise from '@payload-config';

export type Post = {
  id: string;
  title: string;
  slug: string;
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
