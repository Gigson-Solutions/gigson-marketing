import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import BlogPost from '../../../../../src/components/Blog/BlogPost';
import { getPostBySlug, getPostSlugs } from '../../../../../lib/posts';

export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const [esSlugs, enSlugs] = await Promise.all([getPostSlugs('es'), getPostSlugs('en')]);
  return [
    ...esSlugs.map((slug) => ({ locale: 'es', slug })),
    ...enSlugs.map((slug) => ({ locale: 'en', slug })),
  ];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  // Each post exists in exactly one locale (`Posts.locale` field) — filtering
  // here means a request for the "wrong" locale 404s instead of silently
  // rendering the same document twice with incorrect hreflang alternates.
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? '';
  const canonical = locale === 'es'
    ? `${ORIGIN}/es/blog/${slug}`
    : `${ORIGIN}/blog/${slug}`;
  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { 'x-default': canonical, [locale]: canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: coverUrl ? [{ url: coverUrl, alt: post.coverImage?.alt }] : undefined,
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;

  const {
    slug,
    locale
  } = params;

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

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
    ...(coverUrl && { image: coverUrl }),
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
