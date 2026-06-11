'use client';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '../../../i18n/navigation';

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = locale === 'en' ? 'es' : 'en';
  const label = locale === 'en' ? 'ES' : 'EN';

  return (
    <button
      className="language-selector"
      onClick={() => {
        // next-intl: pathname types are strict; ts-expect-error is the documented workaround
        // for locale switching on dynamic routes (see next-intl docs).
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        router.replace(pathname, { locale: targetLocale });
      }}
      aria-label={`Switch to ${targetLocale === 'en' ? 'English' : 'Spanish'}`}
    >
      {label}
    </button>
  );
};

export default LanguageSelector;
