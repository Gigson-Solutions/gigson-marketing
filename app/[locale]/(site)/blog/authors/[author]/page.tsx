import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import JsonLd from '../../../../../../src/shared/ui/JsonLd';
import PostCover from '../../../../../../src/components/Blog/PostCover';
import { Link } from '../../../../../../i18n/navigation';
import { getAuthorBySlug, getAuthorSlugs, getPostsByAuthor } from '../../../../../../lib/authors';
import { buildBreadcrumbSchema, buildPersonSchema } from '../../../../../../lib/schema';

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string; author: string }> };

function localizedField(field: { es?: string; en?: string } | undefined, locale: string): string | undefined {
  if (!field) return undefined;
  return locale === 'es' ? field.es ?? field.en : field.en ?? field.es;
}

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs();
  return [
    ...slugs.map((author) => ({ locale: 'es', author })),
    ...slugs.map((author) => ({ locale: 'en', author })),
  ];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, author: authorSlug } = await props.params;
  const author = await getAuthorBySlug(authorSlug);
  if (!author) return {};

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const title = t('blogAuthor.title', { name: author.name });
  const description = t('blogAuthor.description', { name: author.name });

  return {
    title,
    description,
    openGraph: { type: 'profile', title, description },
  };
}

export default async function AuthorPage(props: Props) {
  const { locale, author: authorSlug } = await props.params;
  const author = await getAuthorBySlug(authorSlug);
  if (!author) notFound();

  const posts = await getPostsByAuthor(author.id, 10);

  const [tCrumb, tMenu, tBlog] = await Promise.all([
    getTranslations({ locale, namespace: 'breadcrumb' }),
    getTranslations({ locale, namespace: 'menu' }),
    getTranslations({ locale, namespace: 'blog' }),
  ]);

  const jobTitle = localizedField(author.jobTitle, locale);
  const bio = localizedField(author.bio, locale);
  const knowsAbout = (author.knowsAbout ?? []).map((item) => item.text).filter(Boolean);

  const personSchema = buildPersonSchema(
    { slug: author.slug, name: author.name, jobTitle, linkedin: author.linkedin, knowsAbout },
    locale,
  );
  // Embedded as `mainEntity`, so drop the inner `@context` — one per JSON-LD
  // script, not one per nested node.
  const { '@context': _personContext, ...personNode } = personSchema;
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: personNode,
  };
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: tCrumb('home'), pathKey: '/' },
      { name: tMenu('blog'), pathKey: '/blog' },
      { name: author.name, url: personSchema.url },
    ],
    locale,
  );

  const photoUrl = author.photo?.sizes?.card?.url ?? author.photo?.url;

  return (
    <div className="wrapper max-w-[70rem] mx-auto py-24 lg:py-32">
      <JsonLd data={profileSchema} />
      <JsonLd data={breadcrumbSchema} />

      <p className="text-smallTag text-purple-accents uppercase tracking-widest mb-3">{tCrumb('authors')}</p>
      <div className="flex items-center gap-6 mb-6">
        {photoUrl && (
          <img src={photoUrl} alt={author.name} className="w-20 h-20 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-h2 text-dark-primary">{author.name}</h1>
          {jobTitle && <p className="text-body text-dark-medium">{jobTitle}</p>}
        </div>
      </div>

      {bio && <p className="text-body text-dark-medium max-w-[42rem] mb-6">{bio}</p>}

      {author.linkedin && (
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener noreferrer me"
          className="inline-block text-purple-accents underline mb-12"
        >
          LinkedIn →
        </a>
      )}

      <h2 className="text-h4 text-dark-primary mb-6">{tBlog('moreFromAuthor', { name: author.name })}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}` as Parameters<typeof Link>[0]['href']}
            className="block group"
          >
            <div className="aspect-[16/9] rounded-[22px] overflow-hidden mb-3">
              <PostCover post={post} variant="card" />
            </div>
            <p className="text-body text-dark-primary group-hover:text-purple-accents transition-colors">
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
