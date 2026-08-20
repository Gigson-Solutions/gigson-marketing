'use client';

import './ProjectEstimator.css';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import ChipSelect from '../../../shared/ui/ChipSelect';
import NumericStepper from '../../../shared/ui/NumericStepper';
import TagInput from '../../../shared/ui/TagInput';
import FeatureModal from './FeatureModal';
import LeadCaptureModal from './LeadCaptureModal';
import {
  APP_ROLES,
  APP_SIZES,
  BUSINESS_DOMAINS,
  PLATFORMS,
  QUALITY_LEVELS,
  ROLE_KEYS,
  type EstimatorFeature,
  type EstimatorInputs,
  type RoleKey,
  type TeamComposition,
  type TimelineData,
} from '@/lib/estimator/types';

const TOTAL_STEPS = 6;

type GenerationStatus = 'idle' | 'generating' | 'ready' | 'failed';

const initialValues: EstimatorInputs = {
  hourlyRate: 50,
  projectDescription: '',
  businessDomain: 'ecommerce' as never, // placeholder, cleared below — no domain pre-selected
  competitors: [],
  roles: [],
  appSize: 'mvp' as never,
  platforms: [],
  uiLevel: 'standard' as never,
  qaLevel: 'standard' as never,
  timelineMode: 'overall',
  timelineOverallMonths: undefined,
};

const ProjectEstimator = () => {
  const t = useTranslations('projectEstimator');
  const locale = useLocale();
  const pagePath = usePathname();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<EstimatorInputs>({
    ...initialValues,
    businessDomain: undefined as unknown as EstimatorInputs['businessDomain'],
    appSize: undefined as unknown as EstimatorInputs['appSize'],
    uiLevel: undefined as unknown as EstimatorInputs['uiLevel'],
    qaLevel: undefined as unknown as EstimatorInputs['qaLevel'],
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [website, setWebsite] = useState(''); // honeypot for session creation

  const [token, setToken] = useState<string | null>(null);
  const [features, setFeatures] = useState<EstimatorFeature[]>([]);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [busy, setBusy] = useState(false);

  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<EstimatorFeature | null>(null);

  const [teamComposition, setTeamComposition] = useState<TeamComposition | null>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [totals, setTotals] = useState<{ totalHours: number; totalBudget: number } | null>(null);

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const setField = <K extends keyof EstimatorInputs>(key: K, value: EstimatorInputs[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const clearError = (key: string) => setErrors((prev) => ({ ...prev, [key]: false }));

  const validateStep = (n: number): boolean => {
    const next: Record<string, boolean> = {};
    if (n === 1) {
      if (!values.projectDescription.trim()) next.projectDescription = true;
      if (!values.businessDomain) next.businessDomain = true;
      if (!values.roles || values.roles.length === 0) next.roles = true;
    }
    if (n === 2) {
      if (!values.appSize) next.appSize = true;
      if (!values.platforms || values.platforms.length === 0) next.platforms = true;
    }
    if (n === 3) {
      if (!values.uiLevel) next.uiLevel = true;
      if (!values.qaLevel) next.qaLevel = true;
    }
    if (n === 4) {
      const hasTimeline =
        values.timelineMode === 'overall'
          ? Boolean(values.timelineOverallMonths)
          : Boolean(values.timelinePhaseMvpMonths || values.timelinePhase2Months || values.timelinePhaseFutureMonths);
      if (!hasTimeline) next.timeline = true;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = (to: number) => {
    if (to > step && !validateStep(step)) return;
    setStep(to);
  };

  const startSession = async (skipGeneration: boolean) => {
    if (!validateStep(4) && !skipGeneration) return;
    setBusy(true);
    setGenerationStatus('generating');
    setStep(5);
    try {
      const res = await fetch('/api/estimator/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: values, locale, pagePath, website, skipGeneration }),
      });
      const data = await res.json();
      setToken(data.token ?? null);
      setFeatures(Array.isArray(data.features) ? data.features : []);
      setGenerationStatus(data.status === 'features_ready' ? 'ready' : 'failed');
    } catch (err) {
      console.error('[project-estimator] session creation failed', err);
      setGenerationStatus('failed');
    } finally {
      setBusy(false);
    }
  };

  const saveFeature = (feature: EstimatorFeature) => {
    setFeatures((prev) => {
      const exists = prev.some((f) => f.clientId === feature.clientId);
      return exists ? prev.map((f) => (f.clientId === feature.clientId ? feature : f)) : [...prev, feature];
    });
  };

  const deleteFeature = (clientId: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('step5.deleteConfirm.description'))) return;
    setFeatures((prev) => prev.filter((f) => f.clientId !== clientId));
  };

  const handleSeeFinalEstimate = async () => {
    if (features.length === 0 || !token) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/estimator/sessions/${token}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });
      const data = await res.json();
      if (res.ok) {
        setTeamComposition(data.teamComposition ?? null);
        setTimeline(data.timeline ?? null);
        setStep(6);
      }
    } catch (err) {
      console.error('[project-estimator] finalize failed', err);
    } finally {
      setBusy(false);
    }
  };

  const handleLeadSubmit = async (data: { name: string; company: string; email: string; rgpd: boolean }) => {
    if (!token) return;
    setLeadSubmitting(true);
    setLeadError(null);
    try {
      const res = await fetch(`/api/estimator/sessions/${token}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setLeadError(json.error ?? t('errors.generic'));
        return;
      }
      setTotals(json.totals);
      setLeadModalOpen(false);
    } catch (err) {
      console.error('[project-estimator] lead submit failed', err);
      setLeadError(t('errors.generic'));
    } finally {
      setLeadSubmitting(false);
    }
  };

  const restart = () => {
    setStep(1);
    setValues({
      ...initialValues,
      businessDomain: undefined as unknown as EstimatorInputs['businessDomain'],
      appSize: undefined as unknown as EstimatorInputs['appSize'],
      uiLevel: undefined as unknown as EstimatorInputs['uiLevel'],
      qaLevel: undefined as unknown as EstimatorInputs['qaLevel'],
    });
    setToken(null);
    setFeatures([]);
    setGenerationStatus('idle');
    setTeamComposition(null);
    setTimeline(null);
    setTotals(null);
  };

  const sidebarSteps = [1, 2, 3, 4, 5, 6];

  return (
    <div className="project-estimator">
      <header className="pe-header">
        <span className="pe-header-tag">{t('hero.eyebrow')}</span>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
      </header>

      <div className="pe-shell">
        <aside className="pe-sidebar">
          <ol>
            {sidebarSteps.map((n) => (
              <li key={n} className={step === n ? 'is-active' : step > n ? 'is-done' : ''}>
                <span className="pe-sidebar-num">{step > n ? '✓' : n}</span>
                <span>{t(`sidebar.step${n}`)}</span>
              </li>
            ))}
          </ol>
        </aside>

        <main className="pe-main">
          <div className="pe-progress" aria-hidden="true">
            <div className="pe-progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>
          <p className="pe-step-of">{t('stepOf', { current: step, total: TOTAL_STEPS })}</p>

          {step === 1 && (
            <Step1
              t={t}
              values={values}
              errors={errors}
              setField={setField}
              clearError={clearError}
            />
          )}
          {step === 2 && <Step2 t={t} values={values} errors={errors} setField={setField} />}
          {step === 3 && <Step3 t={t} values={values} errors={errors} setField={setField} />}
          {step === 4 && (
            <Step4
              t={t}
              values={values}
              errors={errors}
              setField={setField}
              onGenerate={() => startSession(false)}
              onSkip={() => startSession(true)}
              busy={busy}
            />
          )}
          {step === 5 && (
            <Step5
              t={t}
              generationStatus={generationStatus}
              features={features}
              onAdd={() => {
                setEditingFeature(null);
                setFeatureModalOpen(true);
              }}
              onEdit={(f) => {
                setEditingFeature(f);
                setFeatureModalOpen(true);
              }}
              onDelete={deleteFeature}
              onSeeFinalEstimate={handleSeeFinalEstimate}
              busy={busy}
            />
          )}
          {step === 6 && (
            <Step6
              t={t}
              teamComposition={teamComposition}
              timeline={timeline}
              totals={totals}
              onOpenLeadModal={() => setLeadModalOpen(true)}
              onRestart={restart}
            />
          )}

          {step >= 1 && step <= 4 && (
            <div className="pe-step-nav">
              {step > 1 ? (
                <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                  {t('back')}
                </button>
              ) : (
                <span />
              )}
              {step < 4 && (
                <button type="button" className="btn" onClick={() => goNext(step + 1)}>
                  {t('next')}
                </button>
              )}
            </div>
          )}

          {/* Honeypot — hidden from real users, bots may fill it */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            aria-hidden="true"
          />
        </main>
      </div>

      <FeatureModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        onSave={saveFeature}
        initial={editingFeature}
      />
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
        submitting={leadSubmitting}
        error={leadError}
      />
    </div>
  );
};

// ─────────────────────────── Step 1 ───────────────────────────
type Step1Props = {
  t: ReturnType<typeof useTranslations>;
  values: EstimatorInputs;
  errors: Record<string, boolean>;
  setField: <K extends keyof EstimatorInputs>(key: K, value: EstimatorInputs[K]) => void;
  clearError: (key: string) => void;
};

const Step1 = ({ t, values, errors, setField, clearError }: Step1Props) => (
  <div className="pe-step">
    <section className="pe-field">
      <h3>{t('step1.rateLabel')}</h3>
      <p className="pe-help">{t('step1.rateHelp')}</p>
      <NumericStepper
        value={values.hourlyRate}
        onChange={(v) => setField('hourlyRate', v)}
        min={5}
        max={500}
        step={5}
        suffix={t('step1.rateSuffix')}
        ariaLabel={t('step1.rateLabel')}
      />
    </section>

    <section className="pe-field">
      <h3>{t('step1.descLabel')}</h3>
      <p className="pe-help">{t('step1.descHelp')}</p>
      <textarea
        className={`pe-textarea${errors.projectDescription ? ' has-error' : ''}`}
        maxLength={10000}
        placeholder={t('step1.descPlaceholder')}
        value={values.projectDescription}
        onChange={(e) => {
          setField('projectDescription', e.target.value);
          clearError('projectDescription');
        }}
      />
      <span className="pe-counter">{t('step1.descCounter', { count: values.projectDescription.length })}</span>
      {errors.projectDescription && <p className="pe-error">{t('step1.descError')}</p>}
    </section>

    <section className="pe-field">
      <h3>{t('step1.domainLabel')}</h3>
      <p className="pe-help">{t('step1.domainHelp')}</p>
      <ChipSelect
        ariaLabel={t('step1.domainLabel')}
        options={BUSINESS_DOMAINS.map((d) => ({ value: d, title: t(`step1.domain${capitalize(d)}`) }))}
        value={values.businessDomain ? [values.businessDomain] : []}
        onChange={([v]) => {
          setField('businessDomain', v as EstimatorInputs['businessDomain']);
          clearError('businessDomain');
        }}
      />
      {values.businessDomain === 'other' && (
        <input
          type="text"
          className="pe-input"
          placeholder={t('step1.domainOtherPlaceholder')}
          value={values.businessDomainOther ?? ''}
          onChange={(e) => setField('businessDomainOther', e.target.value)}
        />
      )}
      {errors.businessDomain && <p className="pe-error">{t('step1.domainError')}</p>}
    </section>

    <section className="pe-field">
      <h3>{t('step1.competitorsLabel')}</h3>
      <p className="pe-help">{t('step1.competitorsHelp')}</p>
      <TagInput
        value={values.competitors}
        onChange={(next) => setField('competitors', next)}
        max={10}
        placeholder={t('step1.competitorsPlaceholder')}
        ariaLabel={t('step1.competitorsLabel')}
      />
    </section>

    <section className="pe-field">
      <h3>{t('step1.rolesLabel')}</h3>
      <p className="pe-help">{values.businessDomain ? t('step1.rolesHelp') : t('step1.rolesEmptyHelp')}</p>
      <ChipSelect
        ariaLabel={t('step1.rolesLabel')}
        multiple
        disabled={!values.businessDomain}
        options={APP_ROLES.map((r) => ({ value: r, title: t(`step1.role${capitalize(r)}`) }))}
        value={values.roles}
        onChange={(next) => {
          setField('roles', next as EstimatorInputs['roles']);
          clearError('roles');
        }}
      />
      {values.roles.includes('other') && (
        <input
          type="text"
          className="pe-input"
          placeholder={t('step1.domainOtherPlaceholder')}
          value={values.rolesOther ?? ''}
          onChange={(e) => setField('rolesOther', e.target.value)}
        />
      )}
      {errors.roles && <p className="pe-error">{t('step1.rolesError')}</p>}
    </section>
  </div>
);

// ─────────────────────────── Step 2 ───────────────────────────
type StepBasicProps = {
  t: ReturnType<typeof useTranslations>;
  values: EstimatorInputs;
  errors: Record<string, boolean>;
  setField: <K extends keyof EstimatorInputs>(key: K, value: EstimatorInputs[K]) => void;
};

const Step2 = ({ t, values, errors, setField }: StepBasicProps) => (
  <div className="pe-step">
    <section className="pe-field">
      <h3>{t('step2.sizeLabel')}</h3>
      <ChipSelect
        cardStyle
        ariaLabel={t('step2.sizeLabel')}
        options={APP_SIZES.map((s) => ({
          value: s,
          title: t(`step2.size${capitalize(s)}Title`),
          description: t(`step2.size${capitalize(s)}Desc`),
        }))}
        value={values.appSize ? [values.appSize] : []}
        onChange={([v]) => setField('appSize', v as EstimatorInputs['appSize'])}
      />
      {errors.appSize && <p className="pe-error">{t('step2.sizeError')}</p>}
    </section>

    <section className="pe-field">
      <h3>{t('step2.platformsLabel')}</h3>
      <ChipSelect
        cardStyle
        multiple
        ariaLabel={t('step2.platformsLabel')}
        options={PLATFORMS.map((p) => ({
          value: p,
          title: t(`step2.platform${capitalize(p)}Title`),
          description: t(`step2.platform${capitalize(p)}Desc`),
        }))}
        value={values.platforms}
        onChange={(next) => setField('platforms', next as EstimatorInputs['platforms'])}
      />
      {errors.platforms && <p className="pe-error">{t('step2.platformsError')}</p>}
    </section>
  </div>
);

// ─────────────────────────── Step 3 ───────────────────────────
const Step3 = ({ t, values, errors, setField }: StepBasicProps) => (
  <div className="pe-step">
    <section className="pe-field">
      <h3>{t('step3.uiLabel')}</h3>
      <ChipSelect
        cardStyle
        ariaLabel={t('step3.uiLabel')}
        options={QUALITY_LEVELS.map((l) => ({
          value: l,
          title: t(`step3.ui${capitalize(l)}Title`),
          description: t(`step3.ui${capitalize(l)}Desc`),
        }))}
        value={values.uiLevel ? [values.uiLevel] : []}
        onChange={([v]) => setField('uiLevel', v as EstimatorInputs['uiLevel'])}
      />
      {errors.uiLevel && <p className="pe-error">{t('step3.uiError')}</p>}
    </section>

    <section className="pe-field">
      <h3>{t('step3.qaLabel')}</h3>
      <ChipSelect
        cardStyle
        ariaLabel={t('step3.qaLabel')}
        options={QUALITY_LEVELS.map((l) => ({
          value: l,
          title: t(`step3.qa${capitalize(l)}Title`),
          description: t(`step3.qa${capitalize(l)}Desc`),
        }))}
        value={values.qaLevel ? [values.qaLevel] : []}
        onChange={([v]) => setField('qaLevel', v as EstimatorInputs['qaLevel'])}
      />
      {errors.qaLevel && <p className="pe-error">{t('step3.qaError')}</p>}
    </section>
  </div>
);

// ─────────────────────────── Step 4 ───────────────────────────
type Step4Props = StepBasicProps & { onGenerate: () => void; onSkip: () => void; busy: boolean };

const Step4 = ({ t, values, errors, setField, onGenerate, onSkip, busy }: Step4Props) => (
  <div className="pe-step">
    <section className="pe-field">
      <h3>{t('step4.label')}</h3>
      <div className="pe-tabs" role="tablist">
        <button
          type="button"
          className={values.timelineMode === 'overall' ? 'is-active' : ''}
          onClick={() => setField('timelineMode', 'overall')}
        >
          {t('step4.tabOverall')}
        </button>
        <button
          type="button"
          className={values.timelineMode === 'phased' ? 'is-active' : ''}
          onClick={() => setField('timelineMode', 'phased')}
        >
          {t('step4.tabPhased')}
        </button>
      </div>

      {values.timelineMode === 'overall' ? (
        <div className="pe-timeline-field">
          <span>{t('step4.overallLabel')}</span>
          <NumericStepper
            value={values.timelineOverallMonths ?? ''}
            onChange={(v) => setField('timelineOverallMonths', v)}
            min={1}
            max={36}
            suffix={t('step4.monthsSuffix')}
          />
        </div>
      ) : (
        <>
          <div className="pe-timeline-field">
            <span>{t('step4.phaseMvpLabel')}</span>
            <NumericStepper
              value={values.timelinePhaseMvpMonths ?? ''}
              onChange={(v) => setField('timelinePhaseMvpMonths', v)}
              min={0}
              max={36}
              suffix={t('step4.monthsSuffix')}
            />
          </div>
          <div className="pe-timeline-field">
            <span>{t('step4.phase2Label')}</span>
            <NumericStepper
              value={values.timelinePhase2Months ?? ''}
              onChange={(v) => setField('timelinePhase2Months', v)}
              min={0}
              max={36}
              suffix={t('step4.monthsSuffix')}
            />
          </div>
          <div className="pe-timeline-field">
            <span>{t('step4.phaseFutureLabel')}</span>
            <NumericStepper
              value={values.timelinePhaseFutureMonths ?? ''}
              onChange={(v) => setField('timelinePhaseFutureMonths', v)}
              min={0}
              max={36}
              suffix={t('step4.monthsSuffix')}
            />
          </div>
        </>
      )}
      {errors.timeline && <p className="pe-error">{t('step4.timelineError')}</p>}
    </section>

    <div className="pe-step-nav">
      <button type="button" className="btn-secondary" onClick={onSkip} disabled={busy}>
        {t('step4.skip')}
      </button>
      <button type="button" className="btn" onClick={onGenerate} disabled={busy}>
        {t('step4.generate')}
      </button>
    </div>
  </div>
);

// ─────────────────────────── Step 5 ───────────────────────────
const GENERATING_STATUS_KEYS = ['status1', 'status2', 'status3', 'status4'] as const;

type Step5Props = {
  t: ReturnType<typeof useTranslations>;
  generationStatus: GenerationStatus;
  features: EstimatorFeature[];
  onAdd: () => void;
  onEdit: (f: EstimatorFeature) => void;
  onDelete: (clientId: string) => void;
  onSeeFinalEstimate: () => void;
  busy: boolean;
};

const Step5 = ({ t, generationStatus, features, onAdd, onEdit, onDelete, onSeeFinalEstimate, busy }: Step5Props) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (generationStatus !== 'generating') return;
    intervalRef.current = setInterval(() => {
      setStatusIndex((i) => (i + 1) % GENERATING_STATUS_KEYS.length);
    }, 2600);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [generationStatus]);

  if (generationStatus === 'generating') {
    return (
      <div className="pe-step pe-generating">
        <div className="pe-spinner" aria-hidden="true" />
        <h3>{t('step5.generating.title')}</h3>
        <p className="pe-help">{t('step5.generating.note')}</p>
        <ul>
          {GENERATING_STATUS_KEYS.map((key, i) => (
            <li key={key} className={i === statusIndex ? 'is-active' : ''}>
              {t(`step5.generating.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const roleCols: { key: RoleKey; label: string }[] = ROLE_KEYS.map((key) => ({
    key,
    label: t(`step5.col${capitalize(key === 'uiux' ? 'uiux' : key === 'bapm' ? 'bapm' : key)}`),
  }));

  return (
    <div className="pe-step">
      {generationStatus === 'failed' && (
        <div className="pe-notice">
          <strong>{t('step5.failedTitle')}</strong>
          <p>{t('step5.failedNote')}</p>
        </div>
      )}
      <h3>{t('step5.title')}</h3>
      <p className="pe-help">{t('step5.subtitle')}</p>

      <div className="pe-feature-list">
        {features.map((f) => (
          <article className="pe-feature-card" key={f.clientId}>
            <div className="pe-feature-actions">
              <button type="button" aria-label={t('step5.edit')} onClick={() => onEdit(f)}>
                ✎
              </button>
              <button type="button" aria-label={t('step5.delete')} onClick={() => onDelete(f.clientId)}>
                🗑
              </button>
            </div>
            <div className="pe-feature-main">
              <span className="pe-feature-eyebrow">{t('step5.featureName')}</span>
              <h4>{f.name}</h4>
              {f.acceptanceCriteria.length > 0 && (
                <>
                  <span className="pe-feature-eyebrow">{t('step5.acceptanceCriteria')}</span>
                  <ol>
                    {f.acceptanceCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
            <div className="pe-feature-side">
              <span className="pe-feature-eyebrow">{t('step5.thirdPartyServices')}</span>
              <p>{f.thirdPartyServices || '-'}</p>
              {f.userStory && (
                <>
                  <span className="pe-feature-eyebrow">{t('step5.userStory')}</span>
                  <p>{f.userStory}</p>
                </>
              )}
            </div>
            <div className="pe-feature-hours">
              {roleCols.map(({ key, label }) => (
                <div key={key}>
                  <span>{label}</span>
                  <strong>{f.hours[key]}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
        {features.length === 0 && <p className="pe-help">{t('step5.failedNote')}</p>}
      </div>

      <div className="pe-step-nav">
        <button type="button" className="btn-secondary" onClick={onAdd}>
          {t('step5.addFeature')}
        </button>
        <button type="button" className="btn" disabled={busy || features.length === 0} onClick={onSeeFinalEstimate}>
          {t('step5.seeFinalEstimate')}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────── Step 6 ───────────────────────────
type Step6Props = {
  t: ReturnType<typeof useTranslations>;
  teamComposition: TeamComposition | null;
  timeline: TimelineData | null;
  totals: { totalHours: number; totalBudget: number } | null;
  onOpenLeadModal: () => void;
  onRestart: () => void;
};

const Step6 = ({ t, teamComposition, timeline, totals, onOpenLeadModal, onRestart }: Step6Props) => {
  const roleLabel = (role: RoleKey) => t(`step6.role${capitalize(role === 'uiux' ? 'uiux' : role === 'bapm' ? 'bapm' : role)}`);

  return (
    <div className="pe-step">
      <h3>{t('step6.title')}</h3>
      <p className="pe-help">{t('step6.subtitle')}</p>

      {teamComposition && (
        <section className="pe-field">
          <h4 className="pe-eyebrow">{t('step6.deliveryTeam')}</h4>
          <div className="pe-team-grid">
            {ROLE_KEYS.filter((r) => teamComposition[r] > 0).map((role) => (
              <div key={role} className="pe-team-card">
                <span>{roleLabel(role)}</span>
                <strong>{teamComposition[role]}x</strong>
                <span className="pe-help">{t('step6.teamMember')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {timeline && (
        <section className="pe-field">
          <h4 className="pe-eyebrow">{t('step6.timelineTitle')}</h4>
          <div className="pe-gantt">
            {timeline.bars.map((bar) => (
              <div key={bar.role} className="pe-gantt-row">
                <span className="pe-gantt-role">{roleLabel(bar.role)}</span>
                <div className="pe-gantt-track">
                  <div
                    className="pe-gantt-bar"
                    style={{
                      marginLeft: `${((bar.startWeek - 1) / timeline.totalWeeks) * 100}%`,
                      width: `${((bar.endWeek - bar.startWeek + 1) / timeline.totalWeeks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pe-field pe-final-estimate">
        <h4 className="pe-eyebrow">{t('step6.finalEstimateTitle')}</h4>
        {!totals && <p className="pe-help">{t('step6.finalEstimateNote')}</p>}
        <div className="pe-totals">
          <div>
            <span>{t('step6.totalBudget')}</span>
            <strong className={totals ? '' : 'is-blurred'}>
              {totals ? `€${totals.totalBudget.toLocaleString(undefined)}` : '---------'}
            </strong>
          </div>
          <div>
            <span>{t('step6.totalHours')}</span>
            <strong className={totals ? '' : 'is-blurred'}>{totals ? totals.totalHours : '---------'}</strong>
          </div>
        </div>

        {!totals ? (
          <button type="button" className="btn is-wide" onClick={onOpenLeadModal}>
            {t('step6.gateCta')}
          </button>
        ) : (
          <div className="pe-success">
            <h4>{t('step6.successTitle')}</h4>
            <p>{t('step6.successNote')}</p>
            <button type="button" className="btn-secondary" onClick={onRestart}>
              {t('step6.restart')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default ProjectEstimator;
