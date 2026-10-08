'use client';

import { useEffect, useState } from 'react';

// /api/lead silently discards any submission where this arrives filled in. Bots
// fill every field they find; the visitor never sees it. The name is plausible
// on purpose — `_honey` is a published FormSubmit convention that bots already
// know to skip.
const HONEYPOT_STYLE: React.CSSProperties = { display: 'none' };

type AttributionFieldsProps = {
  /** Identifies which form produced the lead, e.g. `home` or `iso27001`. */
  formId: string;
};

/**
 * The hidden half of every lead form: which form it is, plus the two antispam
 * signals the server checks.
 *
 * Campaign attribution is no longer mirrored into hidden inputs here. These
 * forms used to POST urlencoded straight to formsubmit.co, so every value had
 * to exist as an input; now they send JSON to our own route, and the submit
 * handler reads `getAttribution()` directly. Keeping a second copy in the DOM
 * would just be a snapshot that goes stale if the visitor accepts cookies
 * mid-visit.
 */
const AttributionFields = ({ formId }: AttributionFieldsProps) => {
  // Stamped on mount, so the server can tell a form a person actually read from
  // one submitted the instant it loaded. Empty until hydration — a submission
  // with no stamp is treated as suspect, which is the intent.
  const [renderedAt, setRenderedAt] = useState('');

  useEffect(() => setRenderedAt(String(Date.now())), []);

  return (
    <>
      <input type="hidden" name="form_id" value={formId} readOnly />
      <input type="hidden" name="rendered_at" value={renderedAt} readOnly />
      <input
        type="text"
        name="company_website"
        style={HONEYPOT_STYLE}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </>
  );
};

export default AttributionFields;
