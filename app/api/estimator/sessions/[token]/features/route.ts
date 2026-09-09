import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { computeTotalBudget, sumRoleHours, totalHoursOf } from '@/lib/estimator/calc';
import { featuresToPayload } from '@/lib/estimator/payloadMapping';
import { sanitizeFeatures } from '@/lib/estimator/validate';
import { getSessionByToken, updateSession } from '@/lib/estimator/session';

export const runtime = 'nodejs';

// Persists manual edits / adds / removes from step 5 ("Check features"),
// and recomputes running totals. No LLM call here — purely a persist step.
export async function PATCH(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const features = sanitizeFeatures((body as Record<string, unknown>)?.features, 'manual');
  if (features.length === 0) {
    return NextResponse.json({ error: 'At least one feature is required' }, { status: 400 });
  }

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const roleHours = sumRoleHours(features);
  const totalHours = totalHoursOf(roleHours);
  const totalBudget = computeTotalBudget(totalHours, session.hourlyRate ?? 0);

  await updateSession(payloadClient, session.id, {
    features: featuresToPayload(features),
    totalHours,
    totalBudget,
  });

  return NextResponse.json({ ok: true });
}
