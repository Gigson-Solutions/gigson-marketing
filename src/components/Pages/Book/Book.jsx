import React from 'react';
import { useTranslation } from 'react-i18next';

const CALCOM_URL =
  import.meta.env.VITE_CALCOM_GIGSON_URL || 'https://cal.gigsonsolutions.com/gigsonsolutions/30min';

const Book = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[#3C3C3B]">
        {t('book.title', 'Book a meeting')}
      </h1>
      <p className="mt-4 text-gray-600">
        {t('book.subtitle', 'Choose a slot that works for you. Bookings sync with our calendars.')}
      </p>
      <div className="mt-8 min-h-[700px] w-full overflow-hidden rounded-lg border border-gray-200">
        <iframe
          src={CALCOM_URL}
          title={t('book.iframeTitle', 'Book a meeting with Gigson Solutions')}
          className="h-[700px] w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Book;
