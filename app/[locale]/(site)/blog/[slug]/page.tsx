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

// Local, minimal duplicate of the recursive block-collector added to
// `lib/lexical.ts` by PR "seo/05-schema-posts" (not yet merged as of this
// PR) — scoped to just the one block type this file needs. Once that PR
// lands, replace this with `collectBlockFields(post.content, 'keyTakeaways')`.
type LexicalNode = { type?: string; children?: LexicalNode[]; fields?: { blockType?: string; items?: { text: string }[] } };
function collectKeyTakeaways(content: unknown): string[] {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return [];
  const items: string[] = [];
  const walk = (node: LexicalNode | undefined) => {
    if (!node) return;
    if (node.type === 'block' && node.fields?.blockType === 'keyTakeaways') {
      for (const item of node.fields.items ?? []) if (item.text) items.push(item.text);
    }
    node.children?.forEach(walk);
  };
  walk(root);
  return items;
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
  const image = articleImage(post);

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

  // Feeds the post's "Key takeaways" block (if any) into the JSON-LD as a
  // machine-readable abstract — the same self-contained summary a reader
  // sees at the top of the article.
  const takeaways = collectKeyTakeaways(post.content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    abstract: takeaways.length > 0 ? takeaways.join(' ') : undefined,
    url: postUrl(post),
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Gigson Solutions',
    },
    // Points at the one Organization node declared on the home page
    // (`lib/schema.ts`) instead of restating a partial copy of it here.
    publisher: organizationRef,
    // Google's Article rich result wants an image; every post has one now.
    image: articleImage(post),
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
