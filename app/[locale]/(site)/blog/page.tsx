import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import BlogList from '../../../../src/components/Blog/BlogList';
import JsonLd from '../../../../src/shared/ui/JsonLd';
import { getPosts, type Post } from '../../../../lib/posts';
import { ORIGIN, buildBreadcrumbSchema, localizedUrl } from '../../../../lib/schema';

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

// Local, minimal duplicates of `postUrl`/`articleImage`/`organizationMinimal`
// added to `lib/schema.ts` by PR "seo/05-schema-posts" (not yet merged as of
// this PR) — once that lands, this file should import them instead of
// redefining them here.
function postUrl(post: Pick<Post, 'locale' | 'slug'>): string {
  return post.locale === 'es' ? `${ORIGIN}/es/blog/${post.slug}` : `${ORIGIN}/blog/${post.slug}`;
}

function articleImage(post: Pick<Post, 'coverImage'>): string | undefined {
  const uploaded = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;
  if (!uploaded) return undefined;
  return uploaded.startsWith('http') ? uploaded : `${ORIGIN}${uploaded}`;
}

function organizationMinimal() {
  return {
    '@type': 'Organization',
    '@id': `${ORIGIN}/#organization`,
    name: 'Gigson Solutions',
    logo: `${ORIGIN}/gigson-logo.svg`,
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('blog') as { title: string; description: string };
  const canonical = localizedUrl('/blog', locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/blog`,
        es: `${ORIGIN}/es/blog`,
        'x-default': `${ORIGIN}/blog`,
      },
    },
    openGraph: { type: 'website', title: seo.title, description: seo.description, url: canonical, images: ['/opengraph-image'] },
  };
}

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  const posts = await getPosts(locale);

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('blog') as { title: string; description: string };
  const tCrumb = await getTranslations({ locale, namespace: 'breadcrumb' });
  const tMenu = await getTranslations({ locale, namespace: 'menu' });

  const canonical = localizedUrl('/blog', locale);

  // A manifest, not a full dump — cap at the 20 most recent posts.
  const recentPosts = posts.slice(0, 20);
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${canonical}#blog`,
    name: seo.title,
    description: seo.description,
    url: canonical,
    inLanguage: locale,
    publisher: organizationMinimal(),
    blogPost: recentPosts.map((post) => {
      const postCanonical = postUrl(post);
      return {
        '@type': 'BlogPosting',
        '@id': `${postCanonical}#article`,
        headline: post.title,
        url: postCanonical,
        datePublished: post.publishedAt,
        dateModified: (post as { updatedAt?: string }).updatedAt ?? post.publishedAt,
        image: articleImage(post),
        author: { '@type': 'Person', name: post.author ?? 'Gigson Solutions' },
      };
    }),
  };

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
    ],
    locale,
  );

  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      <BlogList posts={posts} />
    </>
  );
}
