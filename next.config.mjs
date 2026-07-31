import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pages that used to be Vite SPA routes now live under app/[locale]/
  // Add 301 redirects for any legacy paths that changed during migration here.
  redirects: async () => [
    // Standalone public pages live outside i18n routing — redirect locale-prefixed URLs to the canonical path
    { source: '/:locale(en|es)/apply-sdr', destination: '/apply-sdr', permanent: true },
    // Removed duplicate Ads landing page (/iso-27001-lp) — consolidated into the
    // live campaign landing at /iso-27001-certification (es: /certificacion-iso-27001)
    { source: '/iso-27001-lp', destination: '/iso-27001-certification', permanent: true },
    {
      source: '/es/certificacion-iso-27001-lp',
      destination: '/es/certificacion-iso-27001',
      permanent: true,
    },
  ],
};

export default withPayload(withNextIntl(nextConfig));
