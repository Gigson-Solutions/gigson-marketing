'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';

import type { Post, PostCategory } from '../../../lib/posts';
import { estimateReadingTime } from '../../../lib/readingTime';
import { Link } from '../../../i18n/navigation';

const CATEGORY_ORDER: PostCategory[] = [
  'agentes-ia',
  'integraciones-erp',
  'casos-exito',
  'sectores',
  'ingenieria-software',
  'consultoria-tecnologica',
  'ciberseguridad',
];

const CategoryBadge = ({ category }: { category?: PostCategory }) => {
  const t = useTranslations('blog');
  if (!category) return null;
  return (
    <span className="inline-flex items-center text-smallTag text-purple-accents uppercase tracking-widest border border-purple-accents rounded-full px-3 py-1">
      {t(`categories.${category}`)}
    </span>
  );
};

const PostMeta = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');
  const format = useFormatter();
  const readingTime = estimateReadingTime(post.content);

  const formattedDate = post.publishedAt
    ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CategoryBadge category={post.category} />
      {post.publishedAt && (
        <time className="text-smallTag text-dark-medium uppercase tracking-widest" dateTime={post.publishedAt}>
          {formattedDate}
        </time>
      )}
      {readingTime !== null && (
        <span className="text-smallTag text-dark-medium uppercase tracking-widest">
          {t('readingTime', { minutes: readingTime })}
        </span>
      )}
    </div>
  );
};

const FeaturedPost = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');
  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

  return (
    <Link
      href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
      className="group grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center border border-ink/20 rounded-[30px] p-6 lg:p-10 hover:border-purple-accents transition-colors"
    >
      <div className="aspect-[4/3] rounded-[22px] overflow-hidden bg-cream">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-light to-purple" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <PostMeta post={post} />
        <h2 className="text-h2 text-dark-primary leading-tight">{post.title}</h2>
        {post.excerpt && (
          <p className="text-body text-dark-medium line-clamp-3">{post.excerpt}</p>
        )}
        <span className="mt-2 self-start text-purple-accents text-button underline group-hover:opacity-70 transition">
          {t('readMore')}
        </span>
      </div>
    </Link>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');
  const coverUrl = post.coverImage?.sizes?.card?.url ?? post.coverImage?.url;

  return (
    <article className="flex flex-col gap-4 border border-ink/20 rounded-[30px] overflow-hidden hover:border-purple-accents transition-colors">
      <div className="aspect-[16/9] overflow-hidden bg-cream">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-light to-purple" />
        )}
      </div>
      <div className="flex flex-col gap-3 p-6 lg:p-8">
        <PostMeta post={post} />
        <h2 className="text-h3 text-dark-primary leading-tight">{post.title}</h2>
        {post.excerpt && (
          <p className="text-body text-dark-medium line-clamp-3">{post.excerpt}</p>
        )}
        <Link
          href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
          className="mt-2 self-start text-purple-accents text-button underline hover:opacity-70 transition"
        >
          {t('readMore')}
        </Link>
      </div>
    </article>
  );
};

type Props = { posts: Post[] };

const BlogList = ({ posts }: Props) => {
  const t = useTranslations('blog');
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  const categories = useMemo(() => {
    const present = CATEGORY_ORDER.filter((cat) => posts.some((p) => p.category === cat));
    return [
      { id: 'all' as const, label: t('allCategories'), count: posts.length },
      ...present.map((cat) => ({
        id: cat,
        label: t(`categories.${cat}`),
        count: posts.filter((p) => p.category === cat).length,
      })),
    ];
  }, [posts, t]);

  const filteredPosts = useMemo(
    () => (activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory)),
    [posts, activeCategory]
  );

  // Featured treatment for the most recent post only applies to the
  // unfiltered view — filtering by category shows a plain grid instead,
  // so "featured" never looks like it's competing with the active filter.
  const showFeatured = activeCategory === 'all';
  const featured = showFeatured ? filteredPosts[0] : undefined;
  const rest = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <div className="max-w-[88.875rem] mx-auto">
        <h1 className="text-h1 text-dark-primary mb-12 lg:mb-16">{t('title')}</h1>

        {posts.length === 0 ? (
          <p className="text-subtitle text-dark-medium">{t('empty')}</p>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-3 mb-12 lg:mb-16">
                {categories.map((cat) => {
                  const isActive = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`inline-flex items-center rounded-full border px-5 py-2 text-body transition-colors ${
                        isActive
                          ? 'bg-purple-accents border-purple-accents text-cream'
                          : 'border-ink text-dark-primary hover:border-purple-accents hover:text-purple-accents'
                      }`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  );
                })}
              </div>
            )}

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
};

export default BlogList;
