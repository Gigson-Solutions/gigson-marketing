import { DEFAULT_LANG, ROUTE_SLUGS, SUPPORTED_LANGS } from './routerSlugs.js';

export const MARKETING_PAGE_KEYS = [
  'integrations',
  'services',
  'industries',
  'logistics',
  'CTO',
  'software',
  'ConsultoriaTec',
  'cibersecurity',
  'iso27001',
  'retail',
  'construction',
  'cases',
  'about',
  'faqs',
  'book',
  'aiAgents',
  'aiManifest',
  'claudePartner',
  'contact',
  'policy',
  'notice',
  'cookies',
];

export function getAllMarketingPathnames() {
  const paths = new Set();

  for (const lang of SUPPORTED_LANGS) {
    const slugs = ROUTE_SLUGS[lang];
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;

    paths.add(prefix || '/');

    for (const key of MARKETING_PAGE_KEYS) {
      const slug = slugs[key];
      if (!slug) continue;
      paths.add(prefix ? `${prefix}/${slug}` : `/${slug}`);
    }
  }

  return [...paths].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
}

export function getMarketingAbsoluteUrls(
  siteOrigin = 'https://gigsonsolutions.com'
) {
  const origin = siteOrigin.replace(/\/$/, '');
  return getAllMarketingPathnames().map(
    (p) => `${origin}${p === '/' ? '/' : p}`
  );
}
