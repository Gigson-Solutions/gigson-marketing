'use client';

import { useLocale } from 'next-intl';
import { useRouter as useNextRouter } from 'next/navigation';

import { usePathname, useRouter } from '../../../i18n/navigation';

const LOCALES = ['en', 'es'] as const;

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();

  const switchTo = (target: string) => {
    // Blog posts don't have a shared pathname across locales: the slug lives in
    // Payload and is translated (`automatiza-tu-holded-con-ia` ↔
    // `automate-holded-with-ai`), so `router.replace(pathname, { locale })` just
    // swapped the prefix and landed on a 404.
    //
    // Every page already declares its counterpart through `alternates.languages`
    // in `generateMetadata` — and for a post that is the only place the sibling
    // slug is known, resolved from `localizedVersion`. Reading the rendered tag
    // keeps the switcher and the hreflang signal from ever disagreeing.
    const alternate = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${target}"]`,
    );

    if (alternate) {
      // The tags carry absolute production URLs; keep the current origin so this
      // still works on preview deployments and locally.
      const { pathname: altPath, search, hash } = new URL(alternate.href, window.location.origin);
      if (altPath !== window.location.pathname) {
        nextRouter.replace(`${altPath}${search}${hash}`);
        return;
      }
    }

    // A post with no translation yet declares no alternate for the other locale.
    // Send those to that locale's blog index rather than to a 404.
    if (pathname.startsWith('/blog/')) {
      router.replace('/blog', { locale: target });
      return;
    }

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
