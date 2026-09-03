import { getPayload } from 'payload';
import type { Where } from 'payload';
import configPromise from '@payload-config';

export type Post = {
  id: string;
  title: string;
  slug: string;
  locale?: 'en' | 'es';
  excerpt?: string;
  coverImage?: { url: string; alt?: string };
  publishedAt?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  contentHtml?: string;
};

async function getPayloadInstance() {
  return getPayload({ config: configPromise });
}

export async function getPosts(locale?: string): Promise<Post[]> {
  try {
    const payload = await getPayloadInstance();

    const conditions: Where[] = [{ status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });

    const result = await payload.find({
      collection: 'posts',
      where: { and: conditions },
      sort: '-publishedAt',
      limit: 50,
    });
    return result.docs as unknown as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string, locale?: string): Promise<Post | null> {
  try {
    const payload = await getPayloadInstance();

    const conditions: Where[] = [{ slug: { equals: slug } }, { status: { equals: 'published' } }];
    if (locale) conditions.push({ locale: { equals: locale } });

    const result = await payload.find({
      collection: 'posts',
      where: { and: conditions },
      limit: 1,
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

    const result = await payload.find({
      collection: 'posts',
      where: { and: conditions },
      select: { slug: true },
      limit: 200,
    });
    return result.docs.map((d) => (d as unknown as { slug: string }).slug);
  } catch {
    return [];
  }
}
