import { notFound } from 'next/navigation';

// Catch-all route for any path under `[locale]` that doesn't match a real page.
//
// Next.js only renders a nested `not-found.tsx` (e.g. `app/[locale]/not-found.tsx`)
// when `notFound()` is thrown from *within* a matched segment. For URLs that don't
// match any route at all, Next falls back to its built-in root 404 page instead of
// the nested one. This catch-all makes truly unknown routes match the `[locale]`
// segment tree and explicitly call `notFound()`, so the custom Gigson 404 design
// in `app/[locale]/not-found.tsx` is used instead of the generic Next.js page.
export default function CatchAll() {
  notFound();
}
