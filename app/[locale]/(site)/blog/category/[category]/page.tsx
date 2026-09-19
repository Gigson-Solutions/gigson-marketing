import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import JsonLd from '../../../../../../src/shared/ui/JsonLd';
import CategoryNav from '../../../../../../src/components/Blog/CategoryNav';
import { FeaturedPost, PostCard } from '../../../../../../src/components/Blog/BlogList';
import { getPosts, type PostCategory } from '../../../../../../lib/posts';
import {
  CATEGORY_SLUGS,
  CATEGORY_SERVICE_PAGE,
  CATEGORY_SERVICE_LABEL_KEY,
  categoryFromSlug,
  categorySlug,
} from '../../../../../../lib/blogCategories';
import { buildBreadcrumbSchema, localizedUrl } from '../../../../../../lib/schema';

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  const categories = Object.keys(CATEGORY_SLUGS) as PostCategory[];
  return categories.flatMap((category) => [
    { locale: 'es', category: categorySlug(category, 'es') },
    { locale: 'en', category: categorySlug(category, 'en') },
  ]);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, category: categorySlugParam } = await props.params;
  const category = categoryFromSlug(categorySlugParam, locale);
  if (!category) return {};

  const tBlog = await getTranslations({ locale, namespace: 'blog' });
  const label = tBlog(`categories.${category}`);
  const title = tBlog('articlesAbout', { label });

  return {
    title: `${title} | Gigson Solutions`,
    openGraph: { type: 'website', title: `${title} | Gigson Solutions` },
  };
}

export default async function BlogCategoryPage(props: Props) {
  const { locale, category: categorySlugParam } = await props.params;
  const category = categoryFromSlug(categorySlugParam, locale);
  if (!category) notFound();

  const allPosts = await getPosts(locale);
  const posts = allPosts.filter((post) => post.category === category);

  const [tBlog, tMenu, tCrumb] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'menu' }),
    getTranslations({ locale, namespace: 'breadcrumb' }),
  ]);

  const label = tBlog(`categories.${category}`);
  const title = tBlog('articlesAbout', { label });

  const servicePathKey = CATEGORY_SERVICE_PAGE[category];
  const serviceLabelKey = CATEGORY_SERVICE_LABEL_KEY[category];
  const serviceHref = servicePathKey ? localizedUrl(servicePathKey, locale) : null;
  const serviceLabel = serviceLabelKey ? tMenu(serviceLabelKey) : null;

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
      { name: label, url: localizedUrl('/blog', locale) },
    ],
    locale,
  );

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-[88.875rem] mx-auto">
        <h1 className="text-h1 text-dark-primary mb-4">{title}</h1>

        {/* Anti-cannibalization: this hub targets the informational query
            about the category, never the commercial head term — that stays
            on the service page linked here. */}
        {serviceHref && serviceLabel && (
          <a
            href={serviceHref}
            className="inline-block mb-12 lg:mb-16 text-purple-accents text-button underline hover:opacity-70 transition"
          >
            {tBlog('viewService', { label: serviceLabel })}
          </a>
        )}

        {posts.length === 0 ? (
          <p className="text-subtitle text-dark-medium">{tBlog('empty')}</p>
        ) : (
          <>
            <CategoryNav posts={allPosts} locale={locale} active={category} />

            {featured && (
              <div className="mb-12 lg:mb-16">
                <FeaturedPost post={featured} />
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {rest.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
