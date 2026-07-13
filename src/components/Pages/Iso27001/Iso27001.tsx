'use client';

import './Iso27001.css';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import solutionsBg from '../../../assets/solutions-applications-bg-gradients-1.svg';
import { Link } from '../../../../i18n/navigation';

const TOTAL_STEPS = 3;
const bgSrc = typeof solutionsBg === 'string' ? solutionsBg : (solutionsBg as { src: string }).src;

const Iso27001 = () => {
  const t = useTranslations('iso27001');

  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    nombre: '',
    empresa: '',
    sector: '',
    cargo: '',
    necesitas: '',
    email: '',
    telefono: '',
  });
  const [invalidField, setInvalidField] = useState<string | undefined>();
  const [contactHint, setContactHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const stepsRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setField = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const flashRequired = (name: string) => {
    setInvalidField(name);
    inputRefs.current[name]?.focus();
    globalThis.setTimeout(() => setInvalidField(undefined), 1400);
  };

  const validateStep = (n: number) => {
    if (n === 1) {
      if (!values.nombre.trim()) { flashRequired('nombre'); return false; }
      if (!values.empresa.trim()) { flashRequired('empresa'); return false; }
      return true;
    }
    if (n === 2) {
      if (!values.necesitas) {
        chipRowRef.current?.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' },
          ],
          { duration: 260, easing: 'ease-out' },
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = (to: number) => {
    if (!validateStep(to - 1)) return;
    setStep(to);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const target = e.target as HTMLElement;
    if (step < TOTAL_STEPS && target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'submit') {
      e.preventDefault();
      goNext(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmail = values.email.trim().length > 0;
    const hasTel = values.telefono.trim().length > 0;
    if (!hasEmail && !hasTel) {
      setContactHint(true);
      inputRefs.current.email?.focus();
      return;
    }
    setContactHint(false);
    setSubmitError(false);
    setSubmitting(true);
    try {
      const res = await fetch('https://formsubmit.co/ajax/jaume@somosgigson.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: values.nombre,
          empresa: values.empresa,
          sector: values.sector,
          cargo: values.cargo,
          necesitas: values.necesitas,
          email: values.email,
          telefono: values.telefono,
          _subject: 'Nuevo lead ISO 27001',
          _cc: 'alfonso.ojeda@gigsonsolutions.com,hello@gigsonsolutions.com',
          _captcha: 'false',
          _template: 'box',
        }),
      });
      if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`);
      const data = await res.json();
      if (data.success !== 'true') throw new Error('FormSubmit reported failure');
      setSubmitted(true);
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error('ISO 27001 lead submit failed', error);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in globalThis)) { setRevealed(true); return; }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setRevealed(true); obs.unobserve(entry.target); }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const invalidStyle = (name: string): React.CSSProperties | undefined =>
    invalidField === name ? { borderBottomColor: 'var(--gs-purple-deep)' } : undefined;

  return (
    <div className="iso27001">
      {/* HERO */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-wrap">
          <div className="hero-inner">
            <span className="hero-tag"><b>{t('hero.tag')}</b></span>
            <h1>
              {t('hero.h1a')}<br />
              {t('hero.h1b')}<br />
              <em className="accent-italic">ISO 27001</em>.<br />
              {t('hero.h1d')}
            </h1>
            <p className="hero-sub">{t('hero.sub')}</p>
            <div className="hero-pills">
              <span className="pill">{t('hero.pill1')}</span>
              <span className="pill">{t('hero.pill2')}</span>
              <span className="pill pill--accent">{t('hero.pill3')}</span>
            </div>
            <div className="hero-cta-row">
              <a href="#form" className="btn is-wide" onClick={scrollToForm}>{t('hero.cta')}</a>
              <span className="hero-note">{t('hero.note')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust">
        <div className="trust-inner">
          <span className="trust-label">{t('trust.label')}</span>
          <div className="trust-items">
            <span className="trust-item">{t('trust.item1')}</span>
            <span className="trust-item">{t('trust.item2')}</span>
            <span className="trust-item">{t('trust.item3')}</span>
            <span className="trust-item">{t('trust.item4')}</span>
          </div>
        </div>
      </div>

      <div
        className="content-bg"
        style={{ backgroundImage: `url(${bgSrc})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
      >
        {/* PAIN */}
        <section className="pain">
          <div className="pain-inner">
            <div className="section-head">
              <span className="eyebrow eyebrow--purple">{t('pain.eyebrow')}</span>
              <h2>
                {t('pain.h2a')}<br />
                {t('pain.h2b')} <em className="accent-italic">{t('pain.h2accent')}</em>.
              </h2>
            </div>
            <div className="pain-grid">
              {(['1', '2', '3', '4'] as const).map((n) => (
                <article key={n} className="card">
                  <div className="card-num">0{n}</div>
                  <h3>{t(`pain.card${n}title` as Parameters<typeof t>[0])}</h3>
                  <p>{t(`pain.card${n}p` as Parameters<typeof t>[0])}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIAL */}
        <section className="diff">
          <div className="diff-inner">
            <div className="diff-slab">
              <div className="section-head">
                <span className="eyebrow eyebrow--oncream">{t('diff.eyebrow')}</span>
                <h2>{t('diff.h2a')}<br />{t('diff.h2b')}</h2>
                <p className="lead">{t('diff.lead')}</p>
              </div>
              <div className="diff-grid">
                {(['1', '2', '3'] as const).map((n) => (
                  <div key={n} className="diff-item">
                    <span className="diff-num">0{n}</span>
                    <h3>{t(`diff.item${n}title` as Parameters<typeof t>[0])}</h3>
                    <p>{t(`diff.item${n}p` as Parameters<typeof t>[0])}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process">
          <div className="process-inner">
            <div className="section-head">
              <span className="eyebrow eyebrow--purple">{t('process.eyebrow')}</span>
              <h2>{t('process.h2a')}<br />{t('process.h2b')}</h2>
              <p className="lead" style={{ maxWidth: '38ch' }}>{t('process.lead')}</p>
            </div>
            <div className={`steps${revealed ? ' is-revealed' : ''}`} ref={stepsRef}>
              {(['1', '2', '3', '4'] as const).map((n) => (
                <div key={n} className="step">
                  <div className="step-num">0{n}</div>
                  <h4>{t(`process.step${n}title` as Parameters<typeof t>[0])}</h4>
                  <p>{t(`process.step${n}p` as Parameters<typeof t>[0])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FORM */}
      <section className="formsec" id="form" ref={formSectionRef}>
        <div className="formsec-inner">
          <div className="formsec-left">
            <span className="eyebrow eyebrow--purple">{t('form.eyebrow')}</span>
            <h2 style={{ marginTop: '18px' }}>
              {t('form.h2a')}<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gs-purple)' }}>{t('form.h2accent')}</em> {t('form.h2b')}
            </h2>
            <p className="lead">{t('form.lead')}</p>
            <div className="deliver-block">
              <div className="deliver">
                <span className="deliver-tag">{t('form.deliver1tag')}</span>
                <p dangerouslySetInnerHTML={{ __html: t.raw('form.deliver1p') as string }} />
              </div>
              <div className="deliver">
                <span className="deliver-tag">
                  {t('form.deliver2tag')}{' '}
                  <span className="deliver-tag-soft">{t('form.deliver2tagSoft')}</span>
                </span>
                <p dangerouslySetInnerHTML={{ __html: t.raw('form.deliver2p') as string }} />
              </div>
            </div>
          </div>

          <div className="form-card" ref={formCardRef}>
            {!submitted && (
              <div id="form-content">
                <div className="formtag">
                  {t('form.step')} {step} {t('form.of')} {TOTAL_STEPS}
                </div>
                <div className="step-bar" aria-hidden="true">
                  <div className="step-bar-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                </div>

                <form className="form wizard" autoComplete="on" noValidate onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                  {/* STEP 1 */}
                  <div className={`form-step${step === 1 ? ' is-active' : ''}`}>
                    <h3>{t('form.step1h3')}</h3>
                    <p className="form-note">{t('form.step1note')}</p>
                    <div className="convo">
                      {[
                        { name: 'nombre', label: 'form.labelName', placeholder: 'form.placeholderName', autoComplete: 'name', type: 'text' },
                        { name: 'empresa', label: 'form.labelCompany', placeholder: 'form.placeholderCompany', autoComplete: 'organization', type: 'text' },
                        { name: 'sector', label: 'form.labelSector', placeholder: 'form.placeholderSector', autoComplete: '', type: 'text' },
                        { name: 'cargo', label: 'form.labelRole', placeholder: 'form.placeholderRole', autoComplete: 'organization-title', type: 'text' },
                      ].map(({ name, label, placeholder, autoComplete, type }) => (
                        <div key={name} className="convo-field">
                          <span className="convo-label">{t(label as Parameters<typeof t>[0])}</span>
                          <span className="convo-fill" style={invalidStyle(name)}>
                            <input
                              type={type}
                              name={name}
                              placeholder={t(placeholder as Parameters<typeof t>[0])}
                              autoComplete={autoComplete || undefined}
                              value={values[name as keyof typeof values]}
                              ref={(el) => { inputRefs.current[name] = el; }}
                              onChange={(e) => setField(name, e.target.value)}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="step-nav">
                      <span className="step-nav-spacer" />
                      <button type="button" className="btn step-next" onClick={() => goNext(2)}>{t('form.next')}</button>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className={`form-step${step === 2 ? ' is-active' : ''}`}>
                    <h3>{t('form.step2h3')}</h3>
                    <p className="form-note">{t('form.step2note')}</p>
                    <div className="convo">
                      <div className="convo-field convo-field--stack">
                        <span className="convo-label">{t('form.needLabel')}</span>
                        <div className="chip-row" role="radiogroup" aria-label={t('form.step2h3')} ref={chipRowRef}>
                          {([
                            ['implantacion', 'form.chip1'],
                            ['certificacion', 'form.chip2'],
                            ['implantacion-certificacion', 'form.chip3'],
                            ['no-seguro', 'form.chip4'],
                          ] as [string, Parameters<typeof t>[0]][]).map(([value, key]) => (
                            <label className="chip" key={value}>
                              <input
                                type="radio"
                                name="necesitas"
                                value={value}
                                checked={values.necesitas === value}
                                onChange={(e) => setField('necesitas', e.target.value)}
                              />
                              <span>{t(key)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="step-nav">
                      <button type="button" className="btn step-prev" onClick={() => setStep(1)}>{t('form.back')}</button>
                      <button type="button" className="btn step-next" onClick={() => goNext(3)}>{t('form.next')}</button>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className={`form-step${step === 3 ? ' is-active' : ''}`}>
                    <h3>{t('form.step3h3')}</h3>
                    <p className="form-note">{t('form.step3note')}</p>
                    <div className="convo">
                      <div className="convo-field">
                        <span className="convo-label">{t('form.labelEmail')}</span>
                        <span className="convo-fill">
                          <input
                            type="email"
                            name="email"
                            placeholder="nombre@tuempresa.com"
                            autoComplete="email"
                            value={values.email}
                            ref={(el) => { inputRefs.current.email = el; }}
                            onChange={(e) => { setField('email', e.target.value); setContactHint(false); }}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">{t('form.labelPhone')}</span>
                        <span className="convo-fill">
                          <input
                            type="tel"
                            name="telefono"
                            placeholder="+34 ___ ___ ___"
                            autoComplete="tel"
                            value={values.telefono}
                            onChange={(e) => { setField('telefono', e.target.value); setContactHint(false); }}
                          />
                        </span>
                      </div>
                    </div>
                    {contactHint && (
                      <p className="contact-hint" dangerouslySetInnerHTML={{ __html: t.raw('form.contactHint') as string }} />
                    )}
                    {submitError && (
                      <p className="contact-hint">{t('form.errorSubmit')}</p>
                    )}
                    <div className="step-nav">
                      <button type="button" className="btn step-prev" onClick={() => setStep(2)} disabled={submitting}>{t('form.back')}</button>
                      <button type="submit" className="btn is-wide step-submit" style={{ justifyContent: 'center' }} disabled={submitting}>
                        {t('form.submit')}
                      </button>
                    </div>
                    <p className="form-legal">
                      {t('form.legal').split('<a>')[0]}
                      <Link href="/policy">
                        {t('form.legal').split('<a>')[1]?.split('</a>')[0]}
                      </Link>
                      {t('form.legal').split('</a>')[1]}
                    </p>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className="success visible" aria-live="polite">
                <div className="success-mark">
                  <svg viewBox="0 0 24 24"><polyline points="4,12 10,18 20,6" /></svg>
                </div>
                <h3>{t('form.successTitle')}</h3>
                <p>{t('form.successP')}</p>
                <a href="https://calendar.app.google/ZAYNg9onVuqktmxH6" target="_blank" rel="noopener noreferrer" className="btn is-wide">
                  {t('form.successCta')}
                </a>
                <p className="success-soft">{t('form.successSoft')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Iso27001;
