import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pages that used to be Vite SPA routes now live under app/[locale]/
  // Add 301 redirects for any legacy paths that changed during migration here.
  redirects: async () => [],
};

export default withPayload(withNextIntl(nextConfig));
