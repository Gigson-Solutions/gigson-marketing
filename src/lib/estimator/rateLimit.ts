// The limiter itself now lives in src/lib/rateLimit.ts so the lead endpoint can
// share it. Kept as a re-export so the estimator routes don't all need touching.
import { createLimiter } from '../rateLimit';

export { getClientIp } from '../rateLimit';

// Full estimate generation (~19 features in one call) — expensive, capped tightly.
export const isRateLimited = createLimiter(3);

// Single-feature "describe it, AI rewrites it" generation — cheaper per call,
// and a user may legitimately want to add several features, so allow more.
export const isFeatureGenRateLimited = createLimiter(15);
