import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import BlogPost from '../../../../../src/components/Blog/BlogPost';
import { getPostBySlug, getPostSlugs } from '../../../../../lib/posts';

export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.flatMap((slug) => [
    { locale: 'en', slug },
    { locale: 'es', slug },
  ]);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? '';
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/blog/${slug}`
    : `${ORIGIN}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/blog/${slug}`,
        es: `${ORIGIN}/es/blog/${slug}`,
        'x-default': `${ORIGIN}/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage ? [{ url: post.coverImage.url, alt: post.coverImage.alt }] : undefined,
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;

  const {
    slug,
    locale
  } = params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${ORIGIN}${locale === 'es' ? '/es' : ''}/blog/${slug}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Gigson Solutions',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gigson Solutions',
      url: ORIGIN,
    },
    ...(post.coverImage && { image: post.coverImage.url }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPost post={post} />
    </>
  );
}
