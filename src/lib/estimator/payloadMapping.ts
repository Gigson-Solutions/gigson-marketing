// Maps between the flat/array shapes Payload collections are happiest with
// (collections/EstimatorSessions.ts) and the richer TypeScript shapes used
// by the API layer + frontend (lib/estimator/types.ts).
import { ROLE_KEYS, type EstimatorFeature } from './types';

export function featuresToPayload(features: EstimatorFeature[]) {
  return features.map((f) => ({
    clientId: f.clientId,
    name: f.name,
    description: f.description,
    thirdPartyServices: f.thirdPartyServices,
    hoursConsulting: f.hours.consulting,
    hoursBuilding: f.hours.building,
    source: f.source,
  }));
}

type PayloadFeatureDoc = {
  clientId?: string | null;
  name?: string | null;
  description?: string | null;
  thirdPartyServices?: string | null;
  hoursConsulting?: number | null;
  hoursBuilding?: number | null;
  source?: 'ai' | 'manual' | null;
};

export function featuresFromPayload(docs: PayloadFeatureDoc[] | null | undefined): EstimatorFeature[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d, i) => ({
    clientId: d.clientId ?? `feat-${i}`,
    name: d.name ?? '',
    description: d.description ?? '',
    thirdPartyServices: d.thirdPartyServices ?? '-',
    hours: {
      consulting: d.hoursConsulting ?? 0,
      building: d.hoursBuilding ?? 0,
    },
    source: d.source ?? 'manual',
  }));
}

export function roleHoursFromPayloadFeatures(docs: PayloadFeatureDoc[] | null | undefined) {
  const totals: Record<(typeof ROLE_KEYS)[number], number> = { consulting: 0, building: 0 };
  for (const f of featuresFromPayload(docs)) {
    for (const role of ROLE_KEYS) totals[role] += f.hours[role];
  }
  return totals;
}
