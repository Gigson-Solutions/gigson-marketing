// Small server-only helper shared by the estimator API routes to load/save
// a session doc by its public token. Centralizes the `as any` casts needed
// because `estimator-sessions` isn't in the generated payload-types.ts until
// `npm run dev` / `payload generate:types` has been run once after adding
// collections/EstimatorSessions.ts — this does not affect runtime behavior,
// only compile-time ergonomics.
import type { BasePayload } from 'payload';

export type EstimatorSessionDoc = {
  id: string | number;
  publicToken: string;
  status: string;
  locale?: string | null;
  hourlyRate?: number | null;
  projectDescription?: string | null;
  businessDomain?: string | null;
  businessDomainOther?: string | null;
  competitors?: Array<{ value?: string | null }> | null;
  roles?: string | null;
  rolesOther?: string | null;
  appSize?: string | null;
  platforms?: string | null;
  uiLevel?: string | null;
  qaLevel?: string | null;
  timelineMode?: string | null;
  timelineOverallMonths?: number | null;
  timelinePhaseMvpMonths?: number | null;
  timelinePhase2Months?: number | null;
  timelinePhaseFutureMonths?: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features?: any[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teamComposition?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeline?: any;
  totalHours?: number | null;
  totalBudget?: number | null;
  leadEmail?: string | null;
};

export async function getSessionByToken(
  payloadClient: BasePayload,
  token: string,
): Promise<EstimatorSessionDoc | null> {
  if (!token) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (payloadClient as any).find({
    collection: 'estimator-sessions',
    where: { publicToken: { equals: token } },
    limit: 1,
  });
  const doc = result?.docs?.[0];
  return doc ?? null;
}

export async function updateSession(
  payloadClient: BasePayload,
  id: string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (payloadClient as any).update({ collection: 'estimator-sessions', id, data });
}
