import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import BlogPost from '../../../../../src/components/Blog/BlogPost';
import JsonLd from '../../../../../src/shared/ui/JsonLd';
import { coverImagePath } from '../../../../../lib/blogCovers';
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

/** Absolute URL of the post's picture. An uploaded cover wins; otherwise this
 * is the rasterised version of the same generated composition the page renders,
 * so social previews and the Article schema always have a real image. */
function articleImage(post: Post): string {
  const uploaded = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;
  if (!uploaded) return `${ORIGIN}${coverImagePath(post)}`;
  // Payload returns an absolute URL on Vercel Blob but a relative /api/media
  // path on local disk storage, so absolutise defensively.
  return uploaded.startsWith('http') ? uploaded : `${ORIGIN}${uploaded}`;
}

/** hreflang alternates for a post. `x-default` always resolves to the EN
 * URL of the cluster when one exists — every other page on the site treats
 * EN as the default — and only falls back to the post's own canonical when
 * there is no EN sibling yet (a post published in ES only, ahead of its
 * translation, must never declare an `x-default` that 404s). */
function postLanguages(post: Post): Record<string, string> {
  const canonical = postUrl(post);
  const sibling = post.localizedVersion && typeof post.localizedVersion === 'object' ? post.localizedVersion : null;

  if (post.locale === 'en') {
    const languages: Record<string, string> = { 'x-default': canonical, en: canonical };
    if (sibling?.locale && sibling.slug) languages[sibling.locale] = postUrl(sibling);
    return languages;
  }

  const enUrl = sibling?.locale === 'en' && sibling.slug ? postUrl(sibling) : null;
  return enUrl ? { 'x-default': enUrl, en: enUrl, es: canonical } : { 'x-default': canonical, es: canonical };
}

type PostSeo = { title: string; description: string; canonical: string; image: string; languages: Record<string, string> };

/** Single source of truth for a post's SEO fields, consumed by both
 * `generateMetadata` and the `Article`/`BlogPosting` JSON-LD below — they used
 * to compute `description` differently (`seoDescription ?? excerpt` vs raw
 * `excerpt`), which could silently drift apart. */
function postSeo(post: Post): PostSeo {
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? '',
    canonical: postUrl(post),
    image: articleImage(post),
    languages: postLanguages(post),
  };
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

  const { title, description, canonical, image, languages } = postSeo(post);

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
      images: [{ url: image, alt: post.coverImage?.alt ?? post.title }],
    },
    // Without an explicit card type X falls back to the small `summary` layout,
    // which shows the cover as a thumbnail instead of a banner.
    twitter: { card: 'summary_large_image', title, description, images: [image] },
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
  const seo = postSeo(post);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: seo.description,
    url: seo.canonical,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Gigson Solutions',
    },
    // Points at the one Organization node declared on the home page
    // (`lib/schema.ts`) instead of restating a partial copy of it here.
    publisher: organizationRef,
    // Google's Article rich result wants an image; every post has one now.
    image: seo.image,
  };

  const [tCrumb, tMenu] = await Promise.all([
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
  ]);
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
      { name: post.title, url: seo.canonical },
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
