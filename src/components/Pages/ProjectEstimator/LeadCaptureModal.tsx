'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link } from '../../../../i18n/navigation';
import { isValidPhone } from '../../../lib/leads/phone';
import Dialog from '../../../shared/ui/Dialog';

export type LeadCaptureData = {
  name: string;
  company: string;
  phone: string;
  email: string;
  rgpd: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadCaptureData) => Promise<void>;
  submitting: boolean;
  error?: string | null;
};

// Loose on purpose: the server runs the real check (syntax, disposable
// domains, MX) in src/lib/email/verifyEmail.ts and the modal shows whatever
// it answers. This only catches "forgot the @" before a round trip.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LeadCaptureModal = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  error,
}: Props) => {
  const t = useTranslations('projectEstimator.step6.modal');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Honeypot — real users never see or fill this field.
  const [website, setWebsite] = useState('');

  if (!isOpen) return null;

  // Every field is required. Same order as the server's checks in
  // app/api/estimator/sessions/[token]/lead/route.ts.
  const firstError = (): string | null => {
    if (!name.trim()) return t('nameRequired');
    if (!company.trim()) return t('companyRequired');
    if (!phone.trim()) return t('phoneRequired');
    if (!isValidPhone(phone)) return t('phoneInvalid');
    if (!email.trim()) return t('emailRequired');
    if (!EMAIL_SHAPE.test(email.trim())) return t('emailInvalid');
    if (!rgpd) return t('rgpdRequired');
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (website.trim().length > 0) return; // bot — silently drop
    const problem = firstError();
    if (problem) {
      setValidationError(problem);
      return;
    }
    setValidationError(null);
    await onSubmit({
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      rgpd,
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      {/* noValidate: we show our own translated messages instead of the
          browser's bubbles, but keep `required` on the inputs for
          assistive tech. */}
      <form className="lead-modal" onSubmit={handleSubmit} noValidate>
        <button
          type="button"
          className="lead-modal-close"
          onClick={onClose}
          aria-label={t('close')}
        >
          ×
        </button>
        <h3>{t('title')}</h3>
        <p>{t('copy')}</p>

        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{
            position: 'absolute',
            left: '-9999px',
            width: 1,
            height: 1,
            opacity: 0,
          }}
          aria-hidden="true"
        />

        <label className="lead-modal-field">
          <span>{t('nameLabel')}*</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="lead-modal-field">
          <span>{t('companyLabel')}*</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            required
            placeholder={t('companyPlaceholder')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label className="lead-modal-field">
          <span>{t('phoneLabel')}*</span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={t('phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="lead-modal-field">
          <span>{t('emailLabel')}*</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="lead-modal-checkbox">
          <input
            type="checkbox"
            name="rgpd"
            required
            checked={rgpd}
            onChange={(e) => setRgpd(e.target.checked)}
          />
          <span>
            {t('rgpdFirst')}
            <Link href="/policy" target="_blank" rel="noopener noreferrer">
              {t('rgpdLink')}
            </Link>
            {t('rgpdThird')}*
          </span>
        </label>

        {(validationError || error) && (
          <p className="lead-modal-error" role="alert">
            {validationError || error}
          </p>
        )}

        <button type="submit" className="btn is-wide" disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>
    </Dialog>
  );
};

export default LeadCaptureModal;
