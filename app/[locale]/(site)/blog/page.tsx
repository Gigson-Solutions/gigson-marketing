import type { Metadata } from 'next';

import BlogList from '../../../../src/components/Blog/BlogList';
import { getPosts } from '../../../../lib/posts';

export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const title = 'Blog | Gigson Solutions';
  const description = 'Insights, guides and case studies on AI, software engineering and technology consulting from the Gigson Solutions team.';
  const canonical = locale === 'es' ? `${ORIGIN}/es/blog` : `${ORIGIN}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${ORIGIN}/blog`,
        es: `${ORIGIN}/es/blog`,
        'x-default': `${ORIGIN}/blog`,
      },
    },
    openGraph: { title, description, url: canonical },
  };
}

export default async function BlogPage(props: Props) {
  const { locale } = await props.params;
  const posts = await getPosts(locale);
  return <BlogList posts={posts} />;
}
