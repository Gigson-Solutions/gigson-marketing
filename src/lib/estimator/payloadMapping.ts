// Maps between the flat/array shapes Payload collections are happiest with
// (collections/EstimatorSessions.ts) and the richer TypeScript shapes used
// by the API layer + frontend (lib/estimator/types.ts).
import { ROLE_KEYS, type EstimatorFeature } from './types';

export function featuresToPayload(features: EstimatorFeature[]) {
  return features.map((f) => ({
    clientId: f.clientId,
    name: f.name,
    userStory: f.userStory,
    acceptanceCriteria: f.acceptanceCriteria.map((criterion) => ({ criterion })),
    thirdPartyServices: f.thirdPartyServices,
    hoursFrontend: f.hours.frontend,
    hoursQa: f.hours.qa,
    hoursBackend: f.hours.backend,
    hoursUiux: f.hours.uiux,
    hoursBapm: f.hours.bapm,
    source: f.source,
  }));
}

type PayloadFeatureDoc = {
  clientId?: string | null;
  name?: string | null;
  userStory?: string | null;
  acceptanceCriteria?: Array<{ criterion?: string | null }> | null;
  thirdPartyServices?: string | null;
  hoursFrontend?: number | null;
  hoursQa?: number | null;
  hoursBackend?: number | null;
  hoursUiux?: number | null;
  hoursBapm?: number | null;
  source?: 'ai' | 'manual' | null;
};

export function featuresFromPayload(docs: PayloadFeatureDoc[] | null | undefined): EstimatorFeature[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d, i) => ({
    clientId: d.clientId ?? `feat-${i}`,
    name: d.name ?? '',
    userStory: d.userStory ?? '',
    acceptanceCriteria: (d.acceptanceCriteria ?? [])
      .map((c) => c?.criterion ?? '')
      .filter((c): c is string => Boolean(c)),
    thirdPartyServices: d.thirdPartyServices ?? '-',
    hours: {
      frontend: d.hoursFrontend ?? 0,
      qa: d.hoursQa ?? 0,
      backend: d.hoursBackend ?? 0,
      uiux: d.hoursUiux ?? 0,
      bapm: d.hoursBapm ?? 0,
    },
    source: d.source ?? 'manual',
  }));
}

export function roleHoursFromPayloadFeatures(docs: PayloadFeatureDoc[] | null | undefined) {
  const totals: Record<(typeof ROLE_KEYS)[number], number> = {
    frontend: 0,
    qa: 0,
    backend: 0,
    uiux: 0,
    bapm: 0,
  };
  for (const f of featuresFromPayload(docs)) {
    for (const role of ROLE_KEYS) totals[role] += f.hours[role];
  }
  return totals;
}
