'use client';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '../../../i18n/navigation';

const LOCALES = ['en', 'es'] as const;

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: string) => {
    // @ts-expect-error next-intl pathname types are strict; this is the documented workaround
    router.replace(pathname, { locale: target });
  };

  return (
    <div className="language-selector" style={{ display: 'flex', alignItems: 'center' }}>
      {LOCALES.map((lang, index) => {
        const isActive = lang === locale;
        return (
          <div key={lang} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => switchTo(lang)}
              className={`language-selector__btn${isActive ? ' language-selector__btn--active' : ''}`}
              aria-label={`Switch to ${lang === 'en' ? 'English' : 'Spanish'}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {lang.toUpperCase()}
            </button>
            {index < LOCALES.length - 1 && (
              <span className="language-selector__sep">/</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
