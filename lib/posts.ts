import { getPayload } from 'payload';
import configPromise from '@payload-config';

export type Post = {
  id: string;
  title: string;
  slug: string;
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

export async function getPosts(): Promise<Post[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
    });
    return result.docs as unknown as Post[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      limit: 1,
    });
    return (result.docs[0] as unknown as Post) ?? null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      select: { slug: true },
      limit: 200,
    });
    return result.docs.map((d) => (d as unknown as { slug: string }).slug);
  } catch {
    return [];
  }
}
