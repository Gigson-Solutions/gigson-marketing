'use client';

import { useTranslations, useFormatter } from 'next-intl';

import type { Post, PostCategory } from '../../../lib/posts';
import { estimateReadingTime } from '../../../lib/readingTime';
import { Link } from '../../../i18n/navigation';
import CategoryNav from './CategoryNav';
import PostCover from './PostCover';

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

export const FeaturedPost = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');

  return (
    <Link
      href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
      className="group grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] gap-8 lg:gap-14 items-center border border-ink/20 rounded-[30px] p-6 lg:p-10 hover:border-purple-accents transition-colors"
    >
      <div className="aspect-[16/9] rounded-[22px] overflow-hidden bg-cream">
        <PostCover post={post} variant="hero" />
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

export const PostCard = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');

  return (
    <article className="flex flex-col gap-4 border border-ink/20 rounded-[30px] overflow-hidden hover:border-purple-accents transition-colors">
      <div className="aspect-[16/9] overflow-hidden bg-cream">
        <PostCover post={post} />
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

type Props = { posts: Post[]; locale: string };

/**
 * `/blog` always shows every post — picking a category in `CategoryNav` now
 * navigates to that category's own archive page (`/blog/category/[category]`)
 * instead of filtering this list client-side. That page is what's indexable
 * per category; this index stays the single "everything, newest first" view.
 */
const BlogList = ({ posts, locale }: Props) => {
  const t = useTranslations('blog');

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <div className="max-w-[88.875rem] mx-auto">
        <h1 className="text-h1 text-dark-primary mb-12 lg:mb-16">{t('title')}</h1>

        {posts.length === 0 ? (
          <p className="text-subtitle text-dark-medium">{t('empty')}</p>
        ) : (
          <>
            <CategoryNav posts={posts} locale={locale} />

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
