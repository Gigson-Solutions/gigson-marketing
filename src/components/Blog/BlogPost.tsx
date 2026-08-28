'use client';

import './Blog.css';

import { useTranslations, useFormatter } from 'next-intl';
import { RichText } from '@payloadcms/richtext-lexical/react';

import type { Post } from '../../../lib/posts';
import { estimateReadingTime } from '../../../lib/readingTime';
import { Link } from '../../../i18n/navigation';
import { jsxConverters } from './richTextConverters';

const RelatedPostCard = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');
  const coverUrl = post.coverImage?.sizes?.card?.url ?? post.coverImage?.url;

  return (
    <Link
      href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
      className="group block border border-ink/20 rounded-[24px] overflow-hidden hover:border-purple-accents transition-colors"
    >
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
      <div className="p-5">
        {post.category && (
          <span className="inline-flex items-center text-smallTag text-purple-accents uppercase tracking-widest border border-purple-accents rounded-full px-3 py-1 mb-3">
            {t(`categories.${post.category}`)}
          </span>
        )}
        <p className="text-body text-dark-primary font-medium leading-snug group-hover:text-purple-accents transition-colors">
          {post.title}
        </p>
      </div>
    </Link>
  );
};

type Props = { post: Post; relatedPosts?: Post[] };

const BlogPost = ({ post, relatedPosts = [] }: Props) => {
  const t = useTranslations('blog');
  const format = useFormatter();

  const formattedDate = post.publishedAt
    ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const readingTime = estimateReadingTime(post.content);
  const coverUrl = post.coverImage?.sizes?.hero?.url ?? post.coverImage?.url;

  return (
    <article className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <div className="max-w-[52rem] mx-auto">
        <Link href="/blog" className="inline-block mb-8 text-purple-accents text-button hover:opacity-70 transition">
          {t('backToBlog')}
        </Link>

        {coverUrl && (
          <div className="aspect-[16/9] rounded-[30px] overflow-hidden mb-10 bg-cream">
            <img
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-10">
          {post.category && (
            <span className="inline-flex items-center text-smallTag text-purple-accents uppercase tracking-widest border border-purple-accents rounded-full px-3 py-1 mb-4">
              {t(`categories.${post.category}`)}
            </span>
          )}
          {(post.publishedAt || readingTime !== null) && (
            <div className="flex flex-wrap items-center gap-x-2 text-smallTag text-dark-medium uppercase tracking-widest">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formattedDate}
                  {post.author && ` · ${post.author}`}
                </time>
              )}
              {post.publishedAt && readingTime !== null && <span>&middot;</span>}
              {readingTime !== null && <span>{t('readingTime', { minutes: readingTime })}</span>}
            </div>
          )}
          <h1 className="mt-4 text-h1 text-dark-primary leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-subtitle text-dark-medium">{post.excerpt}</p>
          )}
        </header>

        {post.content ? (
          <RichText
            data={post.content as Parameters<typeof RichText>[0]['data']}
            converters={jsxConverters}
            className="blog-prose max-w-none"
          />
        ) : (
          <p className="text-body text-dark-medium">{t('contentUnavailable')}</p>
        )}

        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-ink/10">
            <h2 className="text-h4 text-dark-primary mb-8">{t('relatedPosts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => <RelatedPostCard key={related.id} post={related} />)}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
