import type { Metadata } from 'next';

// Root layout — html/body live in app/[locale]/layout.tsx so lang can be set dynamically.
// Next.js requires a root layout; this is a minimal pass-through.
//
// `metadataBase` lives here (a plain static `metadata` export, not inside an
// async `generateMetadata`) so every page's relative OG/twitter image paths
// resolve without Next.js needing to read the request's `Host` header as a
// fallback — that fallback is what was silently forcing every single page
// into fully dynamic rendering (confirmed locally with `export const
// dynamic = 'error'` on /about: "couldn't be rendered statically because it
// used headers()", right after a "metadataBase property in metadata export
// is not set" warning). The `[locale]` layout's own `generateMetadata`
// already set `metadataBase`, but only from an async function — Next only
// reliably avoids the headers() fallback when it's a static export in the
// outermost layout.
export const metadata: Metadata = {
  metadataBase: new URL('https://gigsonsolutions.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
