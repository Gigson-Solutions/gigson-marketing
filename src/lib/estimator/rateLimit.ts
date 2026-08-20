// Soft per-IP rate limit for the costly LLM-generation endpoint, mirroring
// the in-memory Map pattern already used for chatbot sessions
// (app/api/chatbot/chat/route.ts). In-memory state doesn't survive across
// serverless instances/cold starts, so this is a speed bump, not a hard
// guarantee — acceptable for a low-traffic marketing site with no
// Redis/Vercel KV provisioned yet. Revisit with a real store if abuse shows up.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS_PER_WINDOW = 3;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const timestamps = (hits.get(ip) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= MAX_HITS_PER_WINDOW) {
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
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
