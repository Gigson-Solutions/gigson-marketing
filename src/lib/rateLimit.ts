// Soft per-IP rate limits, mirroring the in-memory Map pattern already used for
// chatbot sessions (app/api/chatbot/chat/route.ts). In-memory state doesn't
// survive across serverless instances/cold starts, so this is a speed bump, not
// a hard guarantee — acceptable for a low-traffic marketing site with no
// Redis/Vercel KV provisioned yet. For the lead endpoint it is the third line
// of defence (after the origin check and BotID), not the first. If a
// distributed bot ever makes it matter, a Vercel WAF rate-limit rule runs at
// the edge with no application state and is the better answer than adding Redis.
const DEFAULT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function createLimiter(maxHitsPerWindow: number, windowMs = DEFAULT_WINDOW_MS) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const cutoff = now - windowMs;
    const timestamps = (hits.get(ip) ?? []).filter((t) => t > cutoff);
    if (timestamps.length >= maxHitsPerWindow) {
      hits.set(ip, timestamps);
      return true;
    }
    timestamps.push(now);
    hits.set(ip, timestamps);
    // Opportunistic cleanup so the Map doesn't grow unbounded over the
    // process lifetime.
    if (hits.size > 5000) {
      for (const [key, ts] of hits) {
        if (ts.every((t) => t <= cutoff)) hits.delete(key);
      }
    }
    return false;
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

// Lead forms: a human filling in several of them legitimately (home, then the
// ISO landing) is plausible; a dozen in an hour from one IP is not.
export const isLeadRateLimited = createLimiter(5);
