import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Blog slugs live in Payload and are translated per locale
// (`ai-agents-connected-to-your-erp` ↔ `agentes-ia-conectados-erp-holded-odoo`),
// so they can't be declared in `routing.pathnames`. For every other route
// next-intl translates the pathname when it sends a visitor to their detected
// locale (`/about` → `/es/sobre-nosotros`), but for a post it can only prepend
// the prefix — turning the English URL a Spanish reader just clicked ("Leer en
// inglés", or the EN/ES switcher) into `/es/blog/<english-slug>`, which 404s
// because the post page filters by locale.
//
// An unprefixed post URL is English by definition, so skip locale detection for
// it: the `NEXT_LOCALE` cookie and `Accept-Language` must not override the
// language the slug itself already names. Explicit `/es/blog/…` URLs are
// unaffected (the prefix is resolved before detection), and so is the `/blog`
// index, which does exist in both locales.
const blogPostMiddleware = createMiddleware({ ...routing, localeDetection: false });

const UNPREFIXED_BLOG_POST = /^\/blog\/[^/]+/;

export default function middleware(request: NextRequest) {
  const handle = UNPREFIXED_BLOG_POST.test(request.nextUrl.pathname)
    ? blogPostMiddleware
    : intlMiddleware;

  return handle(request);
}

export const config = {
  matcher: [
    // Exclude Payload admin, API routes, Next.js internals, static files, standalone
    // public pages, the (lab) route group (internal design-system previews that
    // live outside the [locale] segment, e.g. /shapes-lab), and file-convention
    // metadata routes (og/twitter images have no dot in their URL, so they need
    // an explicit exclusion here too).
    '/((?!admin|api|_next/static|_next/image|fav\\.png|img|apply-sdr|opengraph-image|twitter-image|icon|shapes-lab|.*\\..*).*)',
  ],
};
