import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `@payloadcms/storage-vercel-blob`'s client-upload handler pulls in
  // `payload/dist/uploads/safeFetch.js` -> `undici`'s mock utilities, which
  // use `node:*` scheme imports and `worker_threads` that break the
  // production webpack build (works fine in `next dev`). Same issue with
  // `pino`/`pino-abstract-transport` (Payload's logger). Marking them as
  // server externals keeps them as real `require()` calls at runtime
  // instead of being statically bundled/analyzed.
  serverExternalPackages: ['undici', 'pino', 'pino-abstract-transport'],
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
    // Removed the standalone /services (/servicios) overview page — every
    // individual service already has its own dedicated page, linked from
    // the Navbar dropdown and the footer's services directory.
    { source: '/services', destination: '/', permanent: true },
    { source: '/es/servicios', destination: '/es', permanent: true },
  ],
};

export default withPayload(withNextIntl(nextConfig));
