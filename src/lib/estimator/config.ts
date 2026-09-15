// Server-side pricing config for the estimator. The user used to be asked
// for their own "expected hourly rate" (a confusing question — most
// prospects have no idea what a blended dev-team rate should be, and it let
// anyone inflate/deflate their own final budget). Replaced with a single
// blended rate Gigson controls.
//
// IMPORTANT: 45 €/hour below is a placeholder, NOT a confirmed business
// figure — do not treat it as real pricing. Confirm the actual blended rate
// with Jaume/Alfonso before this ships to production, then update
// ESTIMATOR_HOURLY_RATE (env var) accordingly.
export const ESTIMATOR_HOURLY_RATE: number = Number(process.env.ESTIMATOR_HOURLY_RATE) || 45;
