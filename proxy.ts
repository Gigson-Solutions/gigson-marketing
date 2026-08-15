import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude Payload admin, API routes, Next.js internals, static files, and standalone public pages
    '/((?!admin|api|_next/static|_next/image|fav\\.png|img|apply-sdr|.*\\..*).*)',
  ],
};
