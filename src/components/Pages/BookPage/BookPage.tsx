'use client';

import { useTranslations } from 'next-intl';

const GOOGLE_CALENDAR_URL = 'https://calendar.app.google/fwB6AbmedSESMxco7';

const BookPage = () => {
  const t = useTranslations('book');

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[#3C3C3B]">{t('title')}</h1>
      <p className="mt-4 text-gray-600">{t('subtitle')}</p>
      <div className="mt-8 flex justify-center">
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-[#3C3C3B] px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
        >
          {t('iframeTitle')}
        </a>
      </div>
    </div>
  );
};

export default BookPage;
