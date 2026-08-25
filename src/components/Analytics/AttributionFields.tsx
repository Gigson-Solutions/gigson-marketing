'use client';

import { useEffect, useState } from 'react';

import { ATTRIBUTION_FIELDS, type Attribution, getAttribution } from '../../lib/attribution';

// FormSubmit discards any submission where this arrives filled in. Bots fill
// every field they find; the visitor never sees it.
const HONEYPOT_STYLE: React.CSSProperties = { display: 'none' };

type AttributionFieldsProps = {
  /** Identifies which form produced the lead, e.g. `home` or `iso27001`. */
  formId: string;
};

/**
 * The hidden half of every lead form: where the visitor came from, which form
 * they used, and a honeypot. Values resolve after mount because they come from
 * a cookie, so the server-rendered markup starts empty.
 */
const AttributionFields = ({ formId }: AttributionFieldsProps) => {
  const [attribution, setAttribution] = useState<Attribution>({});

  useEffect(() => setAttribution(getAttribution()), []);

  return (
    <>
      {ATTRIBUTION_FIELDS.map((field) => (
        <input key={field} type="hidden" name={field} value={attribution[field] ?? ''} readOnly />
      ))}
      <input type="hidden" name="form_id" value={formId} readOnly />
      <input
        type="text"
        name="_honey"
        style={HONEYPOT_STYLE}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </>
  );
};

export default AttributionFields;
