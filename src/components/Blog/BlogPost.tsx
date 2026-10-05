'use client';

import './Blog.css';

import { useTranslations, useFormatter } from 'next-intl';
import { RichText } from '@payloadcms/richtext-lexical/react';

import type { Post } from '../../../lib/posts';
import { estimateReadingTime } from '../../../lib/readingTime';
import { Link } from '../../../i18n/navigation';
import PostCover from './PostCover';
import { jsxConverters } from './richTextConverters';

const RelatedPostCard = ({ post }: { post: Post }) => {
  const t = useTranslations('blog');

  return (
    <Link
      href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
      className="group block border border-ink/20 rounded-[24px] overflow-hidden hover:border-purple-accents transition-colors"
    >
      <div className="aspect-[16/9] overflow-hidden bg-cream">
        <PostCover post={post} />
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

  const authorProfile =
    post.authorProfile && typeof post.authorProfile === 'object' ? post.authorProfile : null;
  const authorName = authorProfile?.name ?? post.author;
  const authorHref = authorProfile
    ? post.locale === 'es' ? `/es/blog/autores/${authorProfile.slug}` : `/blog/authors/${authorProfile.slug}`
    : null;
  const authorJobTitle = authorProfile
    ? (post.locale === 'es' ? authorProfile.jobTitle?.es ?? authorProfile.jobTitle?.en : authorProfile.jobTitle?.en ?? authorProfile.jobTitle?.es)
    : undefined;
  const authorBio = authorProfile
    ? (post.locale === 'es' ? authorProfile.bio?.es ?? authorProfile.bio?.en : authorProfile.bio?.en ?? authorProfile.bio?.es)
    : undefined;
  const authorPhoto = authorProfile?.photo?.sizes?.thumbnail?.url ?? authorProfile?.photo?.url;

  // `updatedAt` isn't yet on the `Post` type on this branch (added
  // independently by PR "seo/04-sitemap-hreflang") — defensive cast until
  // that PR merges. Only shown when it meaningfully differs from the
  // publish date, not on every edit-and-typo-fix.
  const updatedAt = (post as { updatedAt?: string }).updatedAt;
  const showUpdated =
    updatedAt && post.publishedAt && Math.abs(new Date(updatedAt).getTime() - new Date(post.publishedAt).getTime()) > 24 * 60 * 60 * 1000;
  const formattedUpdatedAt = showUpdated
    ? format.dateTime(new Date(updatedAt as string), { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  // `localizedVersion` may have a different slug than `post` — translated
  // slugs are more idiomatic for SEO than forcing the same one across
  // languages — so this is a plain relative href, not next-intl's typed
  // `Link` (which assumes one shared pathname per locale).
  const sibling = post.localizedVersion && typeof post.localizedVersion === 'object' ? post.localizedVersion : null;
  const siblingHref = sibling
    ? sibling.locale === 'es' ? `/es/blog/${sibling.slug}` : `/blog/${sibling.slug}`
    : null;

  return (
    <article className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
      <div className="max-w-[52rem] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="inline-block text-purple-accents text-button hover:opacity-70 transition">
            {t('backToBlog')}
          </Link>
          {siblingHref && sibling && (
            <a href={siblingHref} className="inline-block text-purple-accents text-button underline hover:opacity-70 transition">
              {sibling.locale === 'es' ? t('readInSpanish') : t('readInEnglish')}
            </a>
          )}
        </div>

        <div className="aspect-[16/9] rounded-[30px] overflow-hidden mb-10 bg-cream">
          <PostCover post={post} variant="hero" />
        </div>

        <header className="mb-10">
          {post.category && (
            <span className="inline-flex items-center text-smallTag text-purple-accents uppercase tracking-widest border border-purple-accents rounded-full px-3 py-1 mb-4">
              {t(`categories.${post.category}`)}
            </span>
          )}
          {(post.publishedAt || readingTime !== null) && (
            <div className="flex flex-wrap items-center gap-x-2 text-smallTag text-dark-medium uppercase tracking-widest">
              {post.publishedAt && <time dateTime={post.publishedAt}>{formattedDate}</time>}
              {post.publishedAt && readingTime !== null && <span>&middot;</span>}
              {readingTime !== null && <span>{t('readingTime', { minutes: readingTime })}</span>}
              {formattedUpdatedAt && (
                <>
                  <span>&middot;</span>
                  <span>{t('updatedOn', { date: formattedUpdatedAt })}</span>
                </>
              )}
            </div>
          )}
          <h1 className="mt-4 text-h1 text-dark-primary leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-subtitle text-dark-medium">{post.excerpt}</p>
          )}

          {authorName && (
            <div className="mt-6 flex items-center gap-3 not-prose">
              {authorPhoto && (
                <img src={authorPhoto} alt={authorName} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div className="text-body text-dark-medium">
                {authorHref ? (
                  <a href={authorHref} rel="author" className="text-dark-primary font-medium hover:text-purple-accents transition-colors">
                    {t('byAuthor', { name: authorName })}
                  </a>
                ) : (
                  <span className="text-dark-primary font-medium">{t('byAuthor', { name: authorName })}</span>
                )}
                {authorJobTitle && <span className="block text-smallTag text-dark-medium">{authorJobTitle}</span>}
              </div>
            </div>
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

        {authorProfile && authorBio && (
          <div className="mt-12 pt-8 border-t border-ink/10 flex items-start gap-4 not-prose">
            {authorPhoto && (
              <img src={authorPhoto} alt={authorProfile.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
            )}
            <div>
              <p className="text-smallTag text-purple-accents uppercase tracking-widest mb-2">{t('aboutTheAuthor')}</p>
              {authorHref ? (
                <a href={authorHref} className="text-body text-dark-primary font-medium hover:text-purple-accents transition-colors">
                  {authorProfile.name}
                </a>
              ) : (
                <p className="text-body text-dark-primary font-medium">{authorProfile.name}</p>
              )}
              <p className="mt-1 text-body text-dark-medium">{authorBio}</p>
            </div>
          </div>
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
