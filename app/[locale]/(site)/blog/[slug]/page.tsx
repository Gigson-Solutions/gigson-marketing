import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import BlogPost from '../../../../../src/components/Blog/BlogPost';
import JsonLd from '../../../../../src/shared/ui/JsonLd';
import { getPostBySlug, getPostSlugs, getRelatedPosts, type Post } from '../../../../../lib/posts';
import { ORIGIN, buildBreadcrumbSchema, organizationRef } from '../../../../../lib/schema';

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string; slug: string }> };

/** Absolute canonical URL for a post, from its own `locale`/`slug` — used
 * both for the post itself and for its `localizedVersion` sibling, which
 * may have a different slug (translated slugs are more idiomatic for SEO
 * than forcing the same one across languages). */
function postUrl(post: Post): string {
  return post.locale === 'es' ? `${ORIGIN}/es/blog/${post.slug}` : `${ORIGIN}/blog/${post.slug}`;
}

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
  const canonical = postUrl(post);
  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

  const sibling = post.localizedVersion && typeof post.localizedVersion === 'object' ? post.localizedVersion : null;
  const languages: Record<string, string> = { 'x-default': canonical, [locale]: canonical };
  if (sibling?.locale && sibling.slug) {
    languages[sibling.locale] = postUrl(sibling);
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: coverUrl ? [{ url: coverUrl, alt: post.coverImage?.alt }] : ['/opengraph-image'],
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

  const relatedPosts = await getRelatedPosts(post, 2);

  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: postUrl(post),
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Gigson Solutions',
    },
    // Points at the one Organization node declared on the home page
    // (`lib/schema.ts`) instead of restating a partial copy of it here.
    publisher: organizationRef,
    ...(coverUrl && { image: coverUrl }),
  };

  const [tCrumb, tMenu] = await Promise.all([
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
      { name: post.title, url: postUrl(post) },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlogPost post={post} relatedPosts={relatedPosts} />
    </>
  );
}
