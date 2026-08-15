'use client';

import { useTranslations, useFormatter } from 'next-intl';

import type { Post } from '../../../lib/posts';
import { Link } from '../../../i18n/navigation';

const PostCard = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');
  const format = useFormatter();

  const formattedDate = post.publishedAt
    ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const coverUrl = post.coverImage?.sizes?.card?.url ?? post.coverImage?.url;

  return (
    <article className="flex flex-col gap-4 border border-ink/20 rounded-[30px] overflow-hidden hover:border-purple-accents transition-colors">
      {coverUrl && (
        <div className="aspect-[16/9] overflow-hidden bg-cream">
          <img
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6 lg:p-8">
        {post.publishedAt && (
          <time className="text-smallTag text-dark-medium uppercase tracking-widest" dateTime={post.publishedAt}>
            {formattedDate}
          </time>
        )}
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

  return (
    <div className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <div className="max-w-[88.875rem] mx-auto">
        <h1 className="text-h1 text-dark-primary mb-12 lg:mb-16">{t('title')}</h1>
        {posts.length === 0 ? (
          <p className="text-subtitle text-dark-medium">{t('empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
