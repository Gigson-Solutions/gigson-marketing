'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Dialog from '../../../shared/ui/Dialog';
import type { EstimatorFeature } from '@/lib/estimator/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: EstimatorFeature) => void;
  initial?: EstimatorFeature | null;
  token: string | null;
  existingFeatureNames: string[];
};

const emptyFeature = (): EstimatorFeature => ({
  clientId: `feat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  userStory: '',
  acceptanceCriteria: [],
  thirdPartyServices: '-',
  hours: { frontend: 0, qa: 0, backend: 0, uiux: 0, bapm: 0 },
  source: 'manual',
});

type Mode = 'describe' | 'review';

// Creating a feature is AI-first: the user describes what they want in
// plain language and Claude rewrites it into a properly scoped feature
// (user story, acceptance criteria, 3rd-party services, hours per role) —
// a regular lead has no reason to know what "BA/PM hours" means. Editing
// an EXISTING (already-generated) feature still shows the full manual
// fields, since that's for correcting the AI's output, not authoring it
// from scratch.
const FeatureModal = ({ isOpen, onClose, onSave, initial, token, existingFeatureNames }: Props) => {
  const t = useTranslations('projectEstimator.step5');
  const [mode, setMode] = useState<Mode>(initial ? 'review' : 'describe');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [draft, setDraft] = useState<EstimatorFeature>(initial ?? emptyFeature());
  const [criteriaText, setCriteriaText] = useState((initial?.acceptanceCriteria ?? []).join('\n'));

  useEffect(() => {
    setMode(initial ? 'review' : 'describe');
    setDescription('');
    setGenerateError(null);
    setDraft(initial ?? emptyFeature());
    setCriteriaText((initial?.acceptanceCriteria ?? []).join('\n'));
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const canSave = draft.name.trim().length > 0;

  const roleFields: { key: keyof EstimatorFeature['hours']; label: string }[] = [
    { key: 'frontend', label: t('colFrontend') },
    { key: 'qa', label: t('colQa') },
    { key: 'backend', label: t('colBackend') },
    { key: 'uiux', label: t('colUiux') },
    { key: 'bapm', label: t('colBapm') },
  ];

  const handleGenerate = async () => {
    if (!description.trim() || !token) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch(`/api/estimator/sessions/${token}/features/generate-one`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, existingFeatureNames }),
      });
      const data = await res.json();
      if (!res.ok || !data.feature) {
        setGenerateError(t('modal.describeError'));
        return;
      }
      const generated: EstimatorFeature = { ...data.feature, clientId: draft.clientId, source: 'ai' };
      setDraft(generated);
      setCriteriaText(generated.acceptanceCriteria.join('\n'));
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
              <button type="button" className="btn-secondary" onClick={() => setMode('review')} disabled={generating}>
                {t('modal.addManually')}
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
              <span>{t('modal.userStoryLabel')}</span>
              <textarea
                value={draft.userStory}
                onChange={(e) => setDraft((d) => ({ ...d, userStory: e.target.value }))}
              />
            </label>

            <label className="feature-modal-field">
              <span>{t('modal.acceptanceCriteriaLabel')}</span>
              <textarea
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                onBlur={() =>
                  setDraft((d) => ({
                    ...d,
                    acceptanceCriteria: criteriaText
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
                  }))
                }
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

            <div className="feature-modal-field">
              <span>{t('modal.hoursLabel')}</span>
              <div className="feature-modal-hours">
                {roleFields.map(({ key, label }) => (
                  <label key={key}>
                    <span>{label}</span>
                    <input
                      type="number"
                      min={0}
                      value={draft.hours[key]}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          hours: { ...d.hours, [key]: Math.max(0, Number(e.target.value) || 0) },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="feature-modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                {t('modal.cancel')}
              </button>
              <button
                type="button"
                className="btn"
                disabled={!canSave}
                onClick={() => {
                  onSave({
                    ...draft,
                    acceptanceCriteria: criteriaText
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
                    source: draft.source === 'ai' ? 'ai' : 'manual',
                  });
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
