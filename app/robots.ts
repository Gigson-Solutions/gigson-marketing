import type { MetadataRoute } from 'next';

import { COMPANY } from '../lib/company';

/**
 * Only the real production deployment should be indexable. Preview and staging
 * deployments served the same `allow: /` to every crawler — including GPTBot and
 * ClaudeBot — and advertised production's sitemap, so a full copy of the site was
 * openly crawlable at staging.gigsonsolutions.com.
 *
 * `VERCEL_ENV` is 'production' only for the production deployment; it is
 * 'preview' for branch deploys (staging included) and undefined locally.
 */
const isProduction = process.env.VERCEL_ENV === 'production';

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Googlebot',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${COMPANY.site.origin}/sitemap.xml`,
  };
}
