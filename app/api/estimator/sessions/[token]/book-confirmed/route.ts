import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { getSessionByToken, updateSession } from '@/lib/estimator/session';

export const runtime = 'nodejs';

// Second gate on Step 6: totalHours is withheld by /lead (see its comment)
// and only released once the user completes a booking in the Cal.com embed
// (BookCallGate.tsx), which fires this on Cal.com's `bookingSuccessful`
// postMessage event. Requires a lead to already exist on the session —
// booking without having gone through /lead first isn't a state the UI
// allows, but we don't trust the client either way.
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  if (!session.leadEmail) {
    return NextResponse.json({ error: 'Complete the estimate form first' }, { status: 400 });
  }

  try {
    await updateSession(payloadClient, session.id, { callBookedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[estimator] failed to persist call booking', err);
    return NextResponse.json({ error: 'Could not save your booking. Please try again.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true, totalHours: session.totalHours ?? 0 });
}
