import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude Payload admin, API routes, Next.js internals, static files, standalone
    // public pages, and file-convention metadata routes (og/twitter images have no
    // dot in their URL, so they need an explicit exclusion here too).
    '/((?!admin|api|_next/static|_next/image|fav\\.png|img|apply-sdr|opengraph-image|twitter-image|icon|.*\\..*).*)',
  ],
};
