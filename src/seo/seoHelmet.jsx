import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_ORIGIN = 'https://gigsonsolutions.com';
const DEFAULT_OG_IMAGE = `${DEFAULT_ORIGIN}/fav.png`;

export function SeoHelmet({
  title,
  description,
  canonicalPath,
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
}) {
  const { pathname } = useLocation();
  const path = canonicalPath ?? pathname;
  const win = globalThis.window;
  const origin =
    win !== undefined && win.location?.origin
      ? win.location.origin
      : DEFAULT_ORIGIN;
  const pathOnly = path.startsWith('http') ? new URL(path).pathname : path;
  const canonicalUrl = path.startsWith('http')
    ? path
    : `${origin}${pathOnly === '/' ? '/' : pathOnly}`;

  return (
    <Helmet>
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

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
