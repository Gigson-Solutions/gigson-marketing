import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { routing } from '../../i18n/routing';
import AttributionCapture from '../../src/components/Analytics/AttributionCapture';
import ConsentScripts from '../../src/components/Analytics/ConsentScripts';
import PageViewTracker from '../../src/components/Analytics/PageViewTracker';
import { GTM_CONTAINER_ID } from '../../src/lib/gtm';
import { SITE_NAME } from '../../lib/schema';
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
    // Only reaches routes that declare no `openGraph` of their own (not-found).
    // Next replaces the key per segment instead of merging it, so every page
    // with its own object repeats `siteName: SITE_NAME` — see lib/schema.ts.
    openGraph: { siteName: SITE_NAME },
    alternates: {
      languages: {
        'en': BASE_URL,
        // Was 'es-ES' while every page declares 'es'; any route without its own
        // `alternates` inherited the mismatched tag.
        'es': `${BASE_URL}/es`,
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
        {/* Google Tag Manager fallback for visitors with JavaScript disabled.
            Note this path cannot read the Consent Mode state — the iframe has no
            dataLayer — so anything the container fires on page view runs here
            unconsented. Harmless while the container is empty; revisit before
            adding GA4 or Ads tags inside GTM. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            title="Google Tag Manager"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AttributionCapture />
        <PageViewTracker />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
