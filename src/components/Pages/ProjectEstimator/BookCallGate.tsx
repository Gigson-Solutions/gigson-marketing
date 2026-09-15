'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

// Cal.com is self-hosted by Gigson (see .env.example) — chosen over a plain
// Google Calendar iframe embed because Cal.com fires a real
// `bookingSuccessful` event the parent page can listen to, so the estimated
// hours (Step 6, ProjectEstimator.tsx) can unblur automatically once a call
// is actually booked. A bare Google Calendar Appointment Schedule embed has
// no such completion callback — it would need a manual "I've booked it"
// button instead, which is easy to click without actually booking.
const CALCOM_ORIGIN = process.env.NEXT_PUBLIC_CALCOM_ORIGIN;
const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;
const CALCOM_NAMESPACE = 'estimator-final-estimate';

type Props = { onBooked: () => void };

const BookCallGate = ({ onBooked }: Props) => {
  useEffect(() => {
    if (!CALCOM_ORIGIN || !CALCOM_LINK) return;
    let cancelled = false;
    let calApi: Awaited<ReturnType<typeof getCalApi>> | null = null;

    const handler = () => onBooked();

    (async () => {
      const api = await getCalApi({ namespace: CALCOM_NAMESPACE });
      if (cancelled) return;
      calApi = api;
      api('on', { action: 'bookingSuccessful', callback: handler });
    })();

    return () => {
      cancelled = true;
      calApi?.('off', { action: 'bookingSuccessful', callback: handler });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CALCOM_ORIGIN || !CALCOM_LINK) {
    // Not configured (e.g. local dev without the env vars) — fail closed
    // without rendering a broken embed. Hours simply stay blurred.
    return null;
  }

  return (
    <div className="pe-book-call">
      <Cal
        namespace={CALCOM_NAMESPACE}
        calOrigin={CALCOM_ORIGIN}
        calLink={CALCOM_LINK}
        style={{ width: '100%', height: '100%', minHeight: '480px', overflow: 'scroll' }}
        config={{ layout: 'month_view' }}
      />
    </div>
  );
};

export default BookCallGate;
