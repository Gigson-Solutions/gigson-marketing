'use client';

import './ProjectEstimator.css';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Dialog from '../../../shared/ui/Dialog';
import type { EstimatorFeaturePublic } from '@/lib/estimator/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: EstimatorFeaturePublic) => void;
  initial?: EstimatorFeaturePublic | null;
  token: string | null;
  existingFeatureNames: string[];
};

const emptyFeature = (): EstimatorFeaturePublic => ({
  clientId: `feat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  description: '',
  thirdPartyServices: '-',
  source: 'manual',
});

type Mode = 'describe' | 'review';

// Adding a use case always goes through the AI: the user describes what they
// want in plain language and Claude rewrites it into a scoped use case (name,
// description, 3rd-party services) and estimates its hours server-side. There
// is no hand-authored path anymore — hours never reach the browser (see
// lib/estimator/features.ts), so a manually typed use case could only ever be
// a zero-hour one, silently understating the estimate. Editing an existing
// use case still shows its text fields, for correcting the AI's wording.
const FeatureModal = ({ isOpen, onClose, onSave, initial, token, existingFeatureNames }: Props) => {
  const t = useTranslations('projectEstimator.step5');
  const [mode, setMode] = useState<Mode>(initial ? 'review' : 'describe');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [draft, setDraft] = useState<EstimatorFeaturePublic>(initial ?? emptyFeature());

  useEffect(() => {
    setMode(initial ? 'review' : 'describe');
    setDescription('');
    setGenerateError(null);
    setDraft(initial ?? emptyFeature());
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const canSave = draft.name.trim().length > 0;

  const handleGenerate = async () => {
    if (!description.trim() || !token) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch(`/api/estimator/sessions/${token}/features/generate-one`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The server persists the generated use case (and its hours) under
        // this clientId, so it has to be ours, not one it makes up.
        body: JSON.stringify({ description, existingFeatureNames, clientId: draft.clientId }),
      });
      const data = await res.json();
      if (!res.ok || !data.feature) {
        setGenerateError(t('modal.describeError'));
        return;
      }
      setDraft({ ...data.feature, clientId: draft.clientId, source: 'ai' });
      setMode('review');
    } catch (err) {
      console.error('[project-estimator] single feature generation failed', err);
      setGenerateError(t('modal.describeError'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      <div className="feature-modal">
        <h3>{initial ? t('modal.editTitle') : t('modal.createTitle')}</h3>

        {mode === 'describe' ? (
          <>
            <label className="feature-modal-field">
              <span>{t('modal.describeLabel')}</span>
              <p className="pe-help">{t('modal.describeHelp')}</p>
              <textarea
                placeholder={t('modal.describePlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={generating}
              />
            </label>
            {generateError && <p className="pe-error">{generateError}</p>}
            <div className="feature-modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={generating}>
                {t('modal.cancel')}
              </button>
              <button
                type="button"
                className="btn"
                disabled={generating || !description.trim()}
                onClick={handleGenerate}
              >
                {generating ? t('modal.generating') : t('modal.generateWithAi')}
              </button>
            </div>
          </>
        ) : (
          <>
            {draft.source === 'ai' && <p className="pe-help">{t('modal.reviewHint')}</p>}
            <label className="feature-modal-field">
              <span>{t('modal.nameLabel')}</span>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </label>

            <label className="feature-modal-field">
              <span>{t('modal.descriptionLabel')}</span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </label>

            <label className="feature-modal-field">
              <span>{t('modal.thirdPartyLabel')}</span>
              <input
                type="text"
                value={draft.thirdPartyServices}
                onChange={(e) => setDraft((d) => ({ ...d, thirdPartyServices: e.target.value }))}
              />
            </label>

            <p className="pe-help">{t('hoursLocked')}</p>

            <div className="feature-modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                {t('modal.cancel')}
              </button>
              <button
                type="button"
                className="btn"
                disabled={!canSave}
                onClick={() => {
                  onSave(draft);
                  onClose();
                }}
              >
                {t('modal.save')}
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default FeatureModal;
