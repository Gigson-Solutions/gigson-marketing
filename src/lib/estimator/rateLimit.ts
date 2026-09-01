// Soft per-IP rate limits for the costly LLM-generation endpoints, mirroring
// the in-memory Map pattern already used for chatbot sessions
// (app/api/chatbot/chat/route.ts). In-memory state doesn't survive across
// serverless instances/cold starts, so this is a speed bump, not a hard
// guarantee — acceptable for a low-traffic marketing site with no
// Redis/Vercel KV provisioned yet. Revisit with a real store if abuse shows up.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function createLimiter(maxHitsPerWindow: number) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const cutoff = now - WINDOW_MS;
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

// Full estimate generation (~19 features in one call) — expensive, capped tightly.
export const isRateLimited = createLimiter(3);

// Single-feature "describe it, AI rewrites it" generation — cheaper per call,
// and a user may legitimately want to add several features, so allow more.
export const isFeatureGenRateLimited = createLimiter(15);

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
