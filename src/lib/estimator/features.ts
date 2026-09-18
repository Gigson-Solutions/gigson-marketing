// Server-side helpers that keep the estimated hours out of the browser.
//
// The hour split (consulting / building) is the thing the lead has to book
// a call to see, so it never travels to the client — not even blurred. That
// means two conversions the API routes share:
//
//   toPublicFeatures()  — what we hand the browser (everything but hours).
//   mergeStoredHours()  — what we do with the list the browser hands back
//                         (Step 5 edits/deletes carry no hours, so each one
//                         is re-paired with the hours we stored for it).
//
// Anything the client invents that we have no stored hours for contributes
// zero — the client cannot make up its own numbers.
import type { EstimatorFeature, EstimatorFeaturePublic } from './types';

export function toPublicFeature(feature: EstimatorFeature): EstimatorFeaturePublic {
  const { hours: _hours, ...rest } = feature;
  return rest;
}

export function toPublicFeatures(features: EstimatorFeature[]): EstimatorFeaturePublic[] {
  return features.map(toPublicFeature);
}

export function mergeStoredHours(
  clientFeatures: EstimatorFeature[],
  storedFeatures: EstimatorFeature[],
): EstimatorFeature[] {
  const storedHours = new Map(storedFeatures.map((f) => [f.clientId, f.hours]));
  return clientFeatures.map((f) => ({
    ...f,
    hours: storedHours.get(f.clientId) ?? { consulting: 0, building: 0 },
  }));
}
