/**
 * Rejects lead submissions that didn't come from one of our own pages.
 *
 * A same-origin `fetch` always sends an `Origin` header, so a missing one means
 * the request wasn't made by a browser running our site — which is exactly the
 * `curl` case that made the old formsubmit.co setup trivially abusable. This is
 * the cheapest of the three defences (origin → BotID → rate limit) and the one
 * that costs a legitimate visitor nothing.
 */
export function isAllowedOrigin(req: Request): boolean {
  const raw = req.headers.get('origin') ?? req.headers.get('referer');
  if (!raw) return false;

  let host: string;
  try {
    host = new URL(raw).host;
  } catch {
    return false;
  }

  const configured = process.env.NEXT_PUBLIC_SERVER_URL;
  if (configured) {
    try {
      if (host === new URL(configured).host) return true;
    } catch {
      // Malformed env var — fall through to the static list below.
    }
  }

  if (host === 'gigsonsolutions.com' || host === 'www.gigsonsolutions.com') return true;
  if (host === 'localhost' || host.startsWith('localhost:')) return true;
  if (host === '127.0.0.1' || host.startsWith('127.0.0.1:')) return true;

  // Vercel preview and staging deployments.
  return host.endsWith('.vercel.app');
}
