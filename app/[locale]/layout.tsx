import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { routing } from '../../i18n/routing';
import AttributionCapture from '../../src/components/Analytics/AttributionCapture';
import ConsentScripts from '../../src/components/Analytics/ConsentScripts';
import PageViewTracker from '../../src/components/Analytics/PageViewTracker';
import '../../src/App.css';

const BASE_URL = 'https://gigsonsolutions.com';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        'en': BASE_URL,
        'es-ES': `${BASE_URL}/es`,
        'x-default': BASE_URL,
      },
    },
  };
}

export default async function LocaleLayout(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Without this, every Server Component using next-intl's server APIs
  // (getTranslations, etc.) falls back to reading the locale from a request
  // header, which opts every single page into fully dynamic rendering
  // site-wide. Routes that also declare `generateStaticParams` + a numeric
  // `revalidate` (like /blog/[slug]) can't be both static and dynamic at
  // once — Next throws `DYNAMIC_SERVER_USAGE` and the request 500s. This is
  // what caused every blog post page to fail in production.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/fav.png" />
        <ConsentScripts />
      </head>
      <body>
        <AttributionCapture />
        <PageViewTracker />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
