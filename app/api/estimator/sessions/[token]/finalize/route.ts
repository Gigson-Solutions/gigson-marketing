import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { computeTeamComposition, computeTimeline, computeTotalBudget, resolveTotalMonths, sumRoleHours, totalHoursOf } from '@/lib/estimator/calc';
import { featuresFromPayload, featuresToPayload } from '@/lib/estimator/payloadMapping';
import { sanitizeFeatures } from '@/lib/estimator/validate';
import { getSessionByToken, updateSession } from '@/lib/estimator/session';

export const runtime = 'nodejs';

// "SEE FINAL ESTIMATE" — computes team composition + timeline from the
// (possibly just-edited) feature list. Deliberately does NOT return
// totalHours/totalBudget in the response: those stay server-side/blurred
// until the lead submits their email via /lead. Purely deterministic math,
// no LLM call, so this is fast and cheap to call freely.
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // body is optional
  }

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const overrideFeatures = (body as Record<string, unknown>)?.features;
  const features = overrideFeatures
    ? sanitizeFeatures(overrideFeatures, 'manual')
    : featuresFromPayload(session.features);
  if (features.length === 0) {
    return NextResponse.json({ error: 'At least one feature is required' }, { status: 400 });
  }

  const roleHours = sumRoleHours(features);
  const totalHours = totalHoursOf(roleHours);
  const totalBudget = computeTotalBudget(totalHours, session.hourlyRate ?? 0);
  const totalMonths = resolveTotalMonths({
    timelineMode: session.timelineMode === 'phased' ? 'phased' : 'overall',
    timelineOverallMonths: session.timelineOverallMonths ?? undefined,
    timelinePhaseMvpMonths: session.timelinePhaseMvpMonths ?? undefined,
    timelinePhase2Months: session.timelinePhase2Months ?? undefined,
    timelinePhaseFutureMonths: session.timelinePhaseFutureMonths ?? undefined,
  });
  const teamComposition = computeTeamComposition(roleHours, totalMonths);
  const timeline = computeTimeline(teamComposition, totalMonths);

  await updateSession(payloadClient, session.id, {
    ...(overrideFeatures ? { features: featuresToPayload(features) } : {}),
    status: 'finalized',
    teamComposition,
    timeline,
    totalHours,
    totalBudget,
  });

  return NextResponse.json({ ok: true, teamComposition, timeline });
}
