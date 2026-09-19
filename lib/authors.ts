import { getPayload } from 'payload';
import type { Where } from 'payload';
import configPromise from '@payload-config';

import type { Post } from './posts';

export type Author = {
  id: string;
  name: string;
  slug: string;
  jobTitle?: { es?: string; en?: string };
  bio?: { es?: string; en?: string };
  photo?: {
    url?: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url?: string };
      card?: { url?: string };
    };
  };
  linkedin?: string;
  knowsAbout?: { text: string }[];
};

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: 'authors',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    return (result.docs[0] as unknown as Author) ?? null;
  } catch {
    return null;
  }
}

export async function getAuthorSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: 'authors',
      select: { slug: true },
      limit: 200,
    });
    return result.docs.map((d) => (d as unknown as { slug: string }).slug);
  } catch {
    return [];
  }
}

/** Published posts (any locale) whose `authorProfile` points at this author,
 * most recent first — for the author page's "more from this author" list and
 * `ProfilePage.mainEntity` context. Does not fall back to the legacy plain-text
 * `author` field: that field can't reliably match an author profile by name. */
export async function getPostsByAuthor(authorId: string, limit = 10): Promise<Post[]> {
  try {
    const payload = await getPayloadInstance();
    const where: Where = {
      and: [{ status: { equals: 'published' } }, { authorProfile: { equals: authorId } }],
    };
    const result = await payload.find({
      collection: 'posts',
      where,
      sort: '-publishedAt',
      limit,
      depth: 1,
    });
    return result.docs as unknown as Post[];
  } catch {
    return [];
  }
}
