'use client';

import { useTranslations } from 'next-intl';

import type { Post, PostCategory } from '../../../lib/posts';
import { categoryHref } from '../../../lib/blogCategories';

const CATEGORY_ORDER: PostCategory[] = [
  'agentes-ia',
  'integraciones-erp',
  'casos-exito',
  'sectores',
  'ingenieria-software',
  'consultoria-tecnologica',
  'ciberseguridad',
];

type Props = {
  posts: Post[];
  locale: string;
  /** The category whose archive page is currently rendering this nav —
   * `undefined` on the plain `/blog` index, where nothing is "active". */
  active?: PostCategory;
};

/**
 * Category pills shared by `/blog` (BlogList) and each `/blog/category/[category]`
 * archive. These are real links to the archive pages now, not a client-side
 * filter — `/blog` itself always shows every post; picking a category
 * navigates away to its own indexable page.
 */
const CategoryNav = ({ posts, locale, active }: Props) => {
  const t = useTranslations('blog');

  // `getPathname()` (inside `categoryHref`) already returns the final,
  // locale-prefixed path — a plain `<a>`, not next-intl's typed `Link`,
  // which would prefix it a second time (`/es/es/blog/...`). Same pattern
  // `BlogPost.tsx` already uses for `siblingHref`/author links: the ES and
  // EN paths differ in more than just the locale prefix (`categoria` vs
  // `category`, translated slugs), so this isn't a case `Link`'s pathname
  // translation (built for static `routing.pathnames` entries) covers.
  const allHref = locale === 'es' ? '/es/blog' : '/blog';

  const present = CATEGORY_ORDER.filter((cat) => posts.some((p) => p.category === cat));
  const categories = [
    { id: undefined, label: t('allCategories'), count: posts.length, href: allHref },
    ...present.map((cat) => ({
      id: cat,
      label: t(`categories.${cat}`),
      count: posts.filter((p) => p.category === cat).length,
      href: categoryHref(cat, locale),
    })),
  ];

  if (categories.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-12 lg:mb-16">
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <a
            key={cat.id ?? 'all'}
            href={cat.href}
            className={`inline-flex items-center rounded-full border px-5 py-2 text-body transition-colors ${
              isActive
                ? 'bg-purple-accents border-purple-accents text-cream'
                : 'border-ink text-dark-primary hover:border-purple-accents hover:text-purple-accents'
            }`}
          >
            {cat.label} ({cat.count})
          </a>
        );
      })}
    </div>
  );
};

export default CategoryNav;
