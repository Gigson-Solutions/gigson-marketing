'use client';

import './Blog.css';

import { useTranslations, useFormatter } from 'next-intl';
import { RichText } from '@payloadcms/richtext-lexical/react';

import type { Post } from '../../../lib/posts';
import { Link } from '../../../i18n/navigation';
import { jsxConverters } from './richTextConverters';

type Props = { post: Post };

const BlogPost = ({ post }: Props) => {
  const t = useTranslations('blog');
  const format = useFormatter();

  const formattedDate = post.publishedAt
    ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

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
          {post.publishedAt && (
            <time className="block text-smallTag text-dark-medium uppercase tracking-widest mb-4" dateTime={post.publishedAt}>
              {formattedDate}
              {post.author && ` · ${post.author}`}
            </time>
          )}
          <h1 className="text-h1 text-dark-primary leading-tight">{post.title}</h1>
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
      </div>
    </article>
  );
};

export default BlogPost;
