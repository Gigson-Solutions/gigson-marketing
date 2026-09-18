import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import BlogPost from '../../../../../src/components/Blog/BlogPost';
import JsonLd from '../../../../../src/shared/ui/JsonLd';
import { collectBlockFields, type FaqBlockFields } from '../../../../../lib/lexical';
import { countWords, estimateReadingTime } from '../../../../../lib/readingTime';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '../../../../../lib/posts';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  organizationMinimal,
  postUrl,
  articleImage,
} from '../../../../../lib/schema';

export const revalidate = 3600;
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

  const canonical = postUrl(post);
  const description = post.seoDescription ?? post.excerpt ?? '';

  // `updatedAt` is a Payload timestamp on every doc regardless of the `Post`
  // TS type declaring it — defensive guard in case a hook ever back-dates it
  // relative to `publishedAt` (shouldn't happen, but a schema shouldn't claim
  // a post was "modified" before it was published).
  const dateModified =
    post.updatedAt && post.publishedAt && post.updatedAt < post.publishedAt
      ? post.publishedAt
      : (post.updatedAt ?? post.publishedAt);

  const [tCrumb, tMenu, tBlog] = await Promise.all([
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
    getTranslations({ locale, namespace: 'blog' }),
  ]);

  const articleSection = post.category ? tBlog(`categories.${post.category}`) : undefined;
  const wordCount = countWords(post.content) ?? undefined;
  const readingMinutes = estimateReadingTime(post.content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    description,
    url: canonical,
    datePublished: post.publishedAt,
    dateModified,
    inLanguage: post.locale,
    articleSection,
    wordCount,
    timeRequired: readingMinutes ? `PT${readingMinutes}M` : undefined,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Gigson Solutions',
    },
    // Inline minimal node (not just an `@id` reference): each post's JSON-LD
    // is evaluated on its own, and Google's Article/BlogPosting rich result
    // requires `publisher.name` — the shared `@id` still lets a crawler treat
    // this as the same entity as the full Organization node on `/`, `/about`,
    // `/contact` and `/about-claude-partner`.
    publisher: organizationMinimal(),
    // Google's Article rich result wants an image; every post has one now.
    image: articleImage(post),
  };

  // Every `faq` block in the post's content, flattened into a single
  // FAQPage — several `<script>` tags with `FAQPage` on the same URL would
  // be duplicate markup, not additive.
  const faqItems = collectBlockFields<FaqBlockFields>(post.content, 'faq')
    .flatMap((block) => block.items ?? [])
    .filter((item) => item.question?.trim() && item.answer?.trim());
  const faqSchemaBase = buildFaqSchema(faqItems, `${canonical}#faq`);
  const faqSchema = faqSchemaBase ? { ...faqSchemaBase, isPartOf: { '@id': canonical } } : null;

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
      { name: post.title, url: canonical },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <BlogPost post={post} relatedPosts={relatedPosts} />
    </>
  );
}
