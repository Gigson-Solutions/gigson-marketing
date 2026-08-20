'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Dialog from '../../../shared/ui/Dialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; company: string; email: string; rgpd: boolean }) => Promise<void>;
  submitting: boolean;
  error?: string | null;
};

const LeadCaptureModal = ({ isOpen, onClose, onSubmit, submitting, error }: Props) => {
  const t = useTranslations('projectEstimator.step6.modal');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Honeypot — real users never see or fill this field.
  const [website, setWebsite] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (website.trim().length > 0) return; // bot — silently drop
    if (!email.trim()) {
      setValidationError(t('emailRequired'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError(t('emailInvalid'));
      return;
    }
    if (!rgpd) {
      setValidationError(t('rgpdRequired'));
      return;
    }
    setValidationError(null);
    await onSubmit({ name: name.trim(), company: company.trim(), email: email.trim(), rgpd });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <div className="lead-modal">
        <button type="button" className="lead-modal-close" onClick={onClose} aria-label={t('close')}>
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
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
          aria-hidden="true"
        />

        <label className="lead-modal-field">
          <span>{t('nameLabel')}</span>
          <input type="text" placeholder={t('namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="lead-modal-field">
          <span>{t('companyLabel')}</span>
          <input
            type="text"
            placeholder={t('companyPlaceholder')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label className="lead-modal-field">
          <span>{t('emailLabel')}*</span>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="lead-modal-checkbox">
          <input type="checkbox" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} />
          <span>{t('rgpdLabel')}</span>
        </label>

        {(validationError || error) && <p className="lead-modal-error">{validationError || error}</p>}

        <button type="button" className="btn is-wide" disabled={submitting} onClick={handleSubmit}>
          {submitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </Dialog>
  );
};

export default LeadCaptureModal;
