import React from 'react';
import { useTranslation } from 'react-i18next';

import { SeoHelmet } from '../../../seo/seoHelmet';

const GOOGLE_CALENDAR_URL = 'https://calendar.app.google/fwB6AbmedSESMxco7';

const Book = () => {
  const { t } = useTranslation();
  const seo = t('pageSeo.book');

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SeoHelmet title={seo.title} description={seo.description} noindex />
      <h1 className="text-3xl font-bold text-[#3C3C3B]">
        {t('book.title', 'Book a meeting')}
      </h1>
      <p className="mt-4 text-gray-600">
        {t(
          'book.subtitle',
          'Choose a slot that works for you. Bookings sync with our calendars.'
        )}
      </p>
      <div className="mt-8 flex justify-center">
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-[#3C3C3B] px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
        >
          {t('book.cta', 'Choose a time slot')}
        </a>
      </div>
    </div>
  );
};

export default Book;
