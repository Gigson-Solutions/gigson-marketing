import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { routing } from '../../i18n/routing';
import ConsentScripts from '../../src/components/Analytics/ConsentScripts';
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

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/fav.png" />
        <ConsentScripts />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
