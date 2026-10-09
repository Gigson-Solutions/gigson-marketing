'use client';

import './Form.css';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link } from '../../i18n/navigation';
import { getAttribution } from '../lib/attribution';
import type { LeadFormId } from '../lib/leads/forms';
import { submitLead } from '../lib/leads/submitLead';
import type { LeadResult } from '../lib/leads/types';
import Button from '../shared/ui/Button';
import AttributionFields from './Analytics/AttributionFields';

// This form is rendered on the home page, /contact and at the bottom of every
// service and industry page, so the id has to come from the call site —
// otherwise every lead looks like a home lead. It also selects the subject and
// recipients, which live server-side in src/lib/leads/forms.ts rather than in
// hidden inputs anyone could read. Unknown ids are rejected by /api/lead, so
// the type is derived from that table.
type FormId = LeadFormId;

type SubmitState = 'idle' | 'sending' | LeadResult;

type FormProps = {
  customClass?: string;
  formId: FormId;
  /** Heading level for the title. /contact has no other heading on the page, so
   *  the form's title has to be its <h1>; the home page renders this form under
   *  its own <h1> and keeps the default <h2>. */
  titleAs?: 'h1' | 'h2';
  /** Overrides the shared `form.title` copy (used by /contact). */
  title?: string;
  /** Pre-selects the service when the form sits on a service page. An index
   *  into `form.service.services[]` rather than a label, because the labels
   *  (and therefore the submitted values) are translated per locale. */
  defaultServiceIndex?: number;
};

const Form = ({
  customClass,
  formId,
  titleAs: Heading = 'h2',
  title: titleOverride,
  defaultServiceIndex,
}: FormProps) => {
  const t = useTranslations('form');
  const locale = useLocale();
  const [state, setState] = useState<SubmitState>('idle');

  const title = titleOverride ?? t('title');
  const name = t.raw('name') as { label: string; placeholder: string };
  const service = t.raw('service') as { label: string; placeholder: string; services: string[] };
  const budget = t.raw('budget') as { label: string; placeholder: string };
  const email = t.raw('email') as { label: string; placeholder: string };
  const details = t.raw('details') as { label: string; placeholder: string };
  const send = t('send');
  const checkbox = t.raw('checkbox') as { first: string; second: string; third: string };
  const defaultService =
    defaultServiceIndex !== undefined ? (service.services[defaultServiceIndex] ?? '') : '';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');

    const data = new FormData(event.currentTarget);
    const value = (field: string) => String(data.get(field) ?? '');

    const result = await submitLead({
      form_id: formId,
      locale: locale === 'en' ? 'en' : 'es',
      page_path: window.location.pathname,
      name: value('name'),
      email: value('email'),
      message: value('description'),
      fields: { service: value('service'), budget: value('budget') },
      // Read at submit time, not at render: the visitor may have accepted
      // cookies after the form mounted.
      attribution: getAttribution(),
      rgpd: data.get('rgpd') === 'on',
      company_website: value('company_website'),
      rendered_at: Number(data.get('rendered_at')) || undefined,
    });

    setState(result);
  };

  if (state === 'sent') {
    return (
      <section className={`${customClass ?? ''} form-section`}>
        <Heading className="form-h2">{title}</Heading>
        <div className="form-success" role="status" aria-live="polite">
          <p className="form-success-title">{t('successTitle')}</p>
          <p>{t('successBody')}</p>
        </div>
      </section>
    );
  }

  return (
    // `id="contacto"` lets a page's hero button scroll here instead of leaving
    // for /contact (CustomErp already does this with IntegrationContactForm).
    <section id="contacto" className={`${customClass ?? ''} form-section`}>
      <Heading className="form-h2">{title}</Heading>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="input-container first">
            <label className="input-container-label">{name.label}</label>
            <input type="text" name="name" required placeholder={name.placeholder} />
          </div>
          <div className="input-container second">
            <label className="input-container-label">{service.label}</label>
            <select name="service" required defaultValue={defaultService}>
              <option value="">{service.placeholder}</option>
              {service.services.map((s: string, i: number) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label className="label-budget">{budget.label}</label>
            <div className="form-budget">
              <input type="radio" id="budgetLess10K" name="budget" value="<10K" />
              <label htmlFor="budgetLess10K" className="form-btn-budget">&lt;10k€</label>
              <input type="radio" id="budgetLess25K" name="budget" value="<25K" />
              <label htmlFor="budgetLess25K" className="form-btn-budget">&lt;25k€</label>
              <input type="radio" id="budgetLess50K" name="budget" value="<50K" />
              <label htmlFor="budgetLess50K" className="form-btn-budget">&lt;50k€</label>
              <input type="radio" id="noIdea" name="budget" value="noIdea" />
              <label htmlFor="noIdea" className="form-btn-budget">{budget.placeholder}</label>
            </div>
          </div>
          <div className="input-container">
            <label className="input-container-label">{email.label}</label>
            <input type="email" name="email" required placeholder={email.placeholder} />
          </div>
          <div className="input-container input-container-text">
            <label htmlFor="input-description" className="input-container-label">
              {details.label}
            </label>
            <input
              id="input-description"
              type="text"
              name="description"
              placeholder={details.placeholder}
            />
          </div>
          <div className="input-container form-check">
            <input type="checkbox" name="rgpd" required className="input-radio" />
            <label>
              {checkbox.first}
              <Link
                className="legal-policity-form"
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {checkbox.second}
              </Link>
              {checkbox.third}
            </label>
          </div>
          <AttributionFields formId={formId} />
        </div>
        {(state === 'error' || state === 'rateLimited') && (
          <p className="form-error" role="alert">
            {t(state === 'rateLimited' ? 'errorRateLimit' : 'error')}
          </p>
        )}
        <Button
          type="submit"
          name={state === 'sending' ? t('sending') : send}
          classStyle="form-btn-send"
          disabled={state === 'sending'}
        />
      </form>
    </section>
  );
};

export default Form;
