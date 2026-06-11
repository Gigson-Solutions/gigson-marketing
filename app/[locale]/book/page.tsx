import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import BookPage from '../../../src/components/Pages/BookPage/BookPage';

const ORIGIN = 'https://gigsonsolutions.com';
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'pageSeo' });
  const seo = t.raw('book') as { title: string; description: string };
  const canonical = locale === 'es' ? `${ORIGIN}/es/reservas` : `${ORIGIN}/book`;

  return {
    title: seo.title,
    description: seo.description,
    robots: { index: false, follow: false },
    alternates: { canonical },
  };
}

export default function BookRoute() {
  return <BookPage />;
}
