import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { DEFAULT_LANG, ROUTE_SLUGS, SUPPORTED_LANGS } from '../router/routerSlugs';

const ORIGIN = 'https://gigsonsolutions.com';
const DEFAULT_OG_IMAGE = `${ORIGIN}/img/gigson-solutions-logo.png`;

function getAlternateUrls(pathname, currentLang) {
  const withoutPrefix =
    currentLang === DEFAULT_LANG
      ? pathname
      : pathname.replace(new RegExp(`^/${currentLang}`), '') || '/';

  const currentSlugs = ROUTE_SLUGS[currentLang] || {};
  const currentSlug = withoutPrefix === '/' ? '' : withoutPrefix.replace(/^\//, '');
  const pageKey = Object.entries(currentSlugs).find(([, slug]) => slug === currentSlug)?.[0];

  const urls = {};
  for (const lang of SUPPORTED_LANGS) {
    if (pageKey) {
      const slug = ROUTE_SLUGS[lang]?.[pageKey];
      if (slug === undefined) continue;
      if (slug === '') {
        urls[lang] = lang === DEFAULT_LANG ? `${ORIGIN}/` : `${ORIGIN}/${lang}`;
      } else {
        const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
        urls[lang] = `${ORIGIN}${prefix}/${slug}`;
      }
    } else {
      urls[lang] = lang === DEFAULT_LANG ? `${ORIGIN}/` : `${ORIGIN}/${lang}`;
    }
  }
  return urls;
}

export function SeoHelmet({
  title,
  description,
  canonicalPath,
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
}) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || DEFAULT_LANG;

  const path = canonicalPath ?? pathname;
  const pathOnly = path.startsWith('http') ? new URL(path).pathname : path;
  const canonicalUrl = path.startsWith('http')
    ? path
    : `${ORIGIN}${pathOnly === '/' ? '/' : pathOnly}`;

  const alternateUrls = getAlternateUrls(pathname, currentLang);
  const hreflangLinks = Object.entries(alternateUrls).map(([lang, url]) => ({
    lang,
    url,
  }));

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {hreflangLinks.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hreflang={lang} href={url} />
      ))}
      {alternateUrls[DEFAULT_LANG] && (
        <link rel="alternate" hreflang="x-default" href={alternateUrls[DEFAULT_LANG]} />
      )}
    </Helmet>
  );
}
