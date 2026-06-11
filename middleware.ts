import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude Payload admin, API routes, Next.js internals, and static files
    '/((?!admin|api|_next/static|_next/image|fav\\.png|img|.*\\..*).*)',
  ],
};
