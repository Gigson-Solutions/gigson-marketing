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
    metadataBase: new URL(BASE_URL),
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
  // header (see node_modules/next-intl/dist/.../RequestLocale.js), which
  // opts every single page into fully dynamic rendering site-wide. This
  // call was present after the Next 15→16 migration (PR #111) but was lost
  // at some point in this branch's history — see agent memory
  // project_pr124_vercel_blob_build_fix.md for that merge.
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
