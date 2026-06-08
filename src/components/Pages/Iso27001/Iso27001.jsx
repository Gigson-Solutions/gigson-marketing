import './Iso27001.css';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import solutionsBg from '../../../assets/solutions-applications-bg-gradients-1.svg';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../../../router/routerSlugs';
import { SeoHelmet } from '../../../seo/seoHelmet';

const TOTAL_STEPS = 3;

const Iso27001 = () => {
  const { t, i18n } = useTranslation();
  const lang = ROUTE_SLUGS[i18n.language] ? i18n.language : DEFAULT_LANG;
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  const policyPath = `${langPrefix}/${ROUTE_SLUGS[lang].policy}`;

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
  const [invalidField, setInvalidField] = useState();
  const [contactHint, setContactHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const stepsRef = useRef(null);
  const formCardRef = useRef(null);
  const formSectionRef = useRef(null);
  const chipRowRef = useRef(null);
  const inputRefs = useRef({});


  const setField = (name, value) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const flashRequired = (name) => {
    setInvalidField(name);
    inputRefs.current[name]?.focus();
    globalThis.setTimeout(() => setInvalidField(undefined), 1400);
  };

  const validateStep = (n) => {
    if (n === 1) {
      if (!values.nombre.trim()) {
        flashRequired('nombre');
        return false;
      }
      if (!values.empresa.trim()) {
        flashRequired('empresa');
        return false;
      }
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
          { duration: 260, easing: 'ease-out' }
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = (to) => {
    if (!validateStep(to - 1)) return;
    setStep(to);
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (
      step < TOTAL_STEPS &&
      e.target.tagName === 'INPUT' &&
      e.target.type !== 'submit'
    ) {
      e.preventDefault();
      goNext(step + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmail = values.email.trim().length > 0;
    const hasTel = values.telefono.trim().length > 0;
    if (!hasEmail && !hasTel) {
      setContactHint(true);
      inputRefs.current.email?.focus();
      return;
    }
    setContactHint(false);
    setSubmitted(true);
    formCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in globalThis)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const invalidStyle = (name) =>
    invalidField === name
      ? { borderBottomColor: 'var(--gs-purple-deep)' }
      : undefined;

  return (
    <div className="iso27001">
      <SeoHelmet
        title={t('iso27001.seo.title')}
        description={t('iso27001.seo.description')}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-mesh" />

        <div className="hero-wrap">
          <div className="hero-inner">
            <span className="hero-tag">
              <b>{t('iso27001.hero.tag')}</b>
            </span>
            <h1>
              {t('iso27001.hero.h1a')}
              <br />{t('iso27001.hero.h1b')}
              <br />
              <em className="accent-italic">ISO 27001</em>.<br />
              {t('iso27001.hero.h1d')}
            </h1>
            <p className="hero-sub">{t('iso27001.hero.sub')}</p>
            <div className="hero-pills">
              <span className="pill">{t('iso27001.hero.pill1')}</span>
              <span className="pill">{t('iso27001.hero.pill2')}</span>
              <span className="pill pill--accent">{t('iso27001.hero.pill3')}</span>
            </div>
            <div className="hero-cta-row">
              <a href="#form" className="btn is-wide" onClick={scrollToForm}>
                {t('iso27001.hero.cta')}
              </a>
              <span className="hero-note">
                {t('iso27001.hero.note')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust">
        <div className="trust-inner">
          <span className="trust-label">{t('iso27001.trust.label')}</span>
          <div className="trust-items">
            <span className="trust-item">{t('iso27001.trust.item1')}</span>
            <span className="trust-item">{t('iso27001.trust.item2')}</span>
            <span className="trust-item">{t('iso27001.trust.item3')}</span>
            <span className="trust-item">{t('iso27001.trust.item4')}</span>
          </div>
        </div>
      </div>

      <div
        className="content-bg"
        style={{
          backgroundImage: `url(${solutionsBg})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >

      {/* PAIN */}
      <section className="pain">
        <div className="pain-inner">
          <div className="section-head">
            <span className="eyebrow eyebrow--purple">{t('iso27001.pain.eyebrow')}</span>
            <h2>
              {t('iso27001.pain.h2a')}
              <br />
              {t('iso27001.pain.h2b')} <em className="accent-italic">{t('iso27001.pain.h2accent')}</em>.
            </h2>
          </div>
          <div className="pain-grid">
            <article className="card">
              <div className="card-num">01</div>
              <h3>{t('iso27001.pain.card1title')}</h3>
              <p>{t('iso27001.pain.card1p')}</p>
            </article>
            <article className="card">
              <div className="card-num">02</div>
              <h3>{t('iso27001.pain.card2title')}</h3>
              <p>{t('iso27001.pain.card2p')}</p>
            </article>
            <article className="card">
              <div className="card-num">03</div>
              <h3>{t('iso27001.pain.card3title')}</h3>
              <p>{t('iso27001.pain.card3p')}</p>
            </article>
            <article className="card">
              <div className="card-num">04</div>
              <h3>{t('iso27001.pain.card4title')}</h3>
              <p>{t('iso27001.pain.card4p')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* DIFFERENTIAL */}
      <section className="diff">
        <div className="diff-inner">
          <div className="diff-slab">
            <div className="section-head">
              <span className="eyebrow eyebrow--oncream">{t('iso27001.diff.eyebrow')}</span>
              <h2>
                {t('iso27001.diff.h2a')}
                <br />
                {t('iso27001.diff.h2b')}
              </h2>
              <p className="lead">{t('iso27001.diff.lead')}</p>
            </div>
            <div className="diff-grid">
              <div className="diff-item">
                <span className="diff-num">01</span>
                <h3>{t('iso27001.diff.item1title')}</h3>
                <p>{t('iso27001.diff.item1p')}</p>
              </div>
              <div className="diff-item">
                <span className="diff-num">02</span>
                <h3>{t('iso27001.diff.item2title')}</h3>
                <p>{t('iso27001.diff.item2p')}</p>
              </div>
              <div className="diff-item">
                <span className="diff-num">03</span>
                <h3>{t('iso27001.diff.item3title')}</h3>
                <p>{t('iso27001.diff.item3p')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="section-head">
            <span className="eyebrow eyebrow--purple">{t('iso27001.process.eyebrow')}</span>
            <h2>
              {t('iso27001.process.h2a')}
              <br />
              {t('iso27001.process.h2b')}
            </h2>
            <p className="lead" style={{ maxWidth: '38ch' }}>
              {t('iso27001.process.lead')}
            </p>
          </div>

          <div
            className={`steps${revealed ? ' is-revealed' : ''}`}
            ref={stepsRef}
          >
            <div className="step">
              <div className="step-num">01</div>
              <h4>{t('iso27001.process.step1title')}</h4>
              <p>{t('iso27001.process.step1p')}</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h4>{t('iso27001.process.step2title')}</h4>
              <p>{t('iso27001.process.step2p')}</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>{t('iso27001.process.step3title')}</h4>
              <p>{t('iso27001.process.step3p')}</p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h4>{t('iso27001.process.step4title')}</h4>
              <p>{t('iso27001.process.step4p')}</p>
            </div>
          </div>
        </div>
      </section>

      </div>{/* end content-bg */}

      {/* FORM */}
      <section className="formsec" id="form" ref={formSectionRef}>
        <div className="formsec-inner">
          <div className="formsec-left">
            <span className="eyebrow eyebrow--purple">
              {t('iso27001.form.eyebrow')}
            </span>
            <h2 style={{ marginTop: '18px' }}>
              {t('iso27001.form.h2a')}
              <br />{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gs-purple)' }}>
                {t('iso27001.form.h2accent')}
              </em>{' '}
              {t('iso27001.form.h2b')}
            </h2>
            <p className="lead">{t('iso27001.form.lead')}</p>

            <div className="deliver-block">
              <div className="deliver">
                <span className="deliver-tag">{t('iso27001.form.deliver1tag')}</span>
                <p dangerouslySetInnerHTML={{ __html: t('iso27001.form.deliver1p') }} />
              </div>
              <div className="deliver">
                <span className="deliver-tag">
                  {t('iso27001.form.deliver2tag')}{' '}
                  <span className="deliver-tag-soft">{t('iso27001.form.deliver2tagSoft')}</span>
                </span>
                <p dangerouslySetInnerHTML={{ __html: t('iso27001.form.deliver2p') }} />
              </div>
            </div>
          </div>

          <div className="form-card" ref={formCardRef}>
            {!submitted && (
              <div id="form-content">
                <div className="formtag">
                  {t('iso27001.form.step')} {step} {t('iso27001.form.of')} {TOTAL_STEPS}
                </div>
                <div className="step-bar" aria-hidden="true">
                  <div
                    className="step-bar-fill"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  />
                </div>

                <form
                  className="form wizard"
                  autoComplete="on"
                  noValidate
                  onSubmit={handleSubmit}
                  onKeyDown={handleKeyDown}
                >
                  {/* STEP 1 */}
                  <div className={`form-step${step === 1 ? ' is-active' : ''}`}>
                    <h3>{t('iso27001.form.step1h3')}</h3>
                    <p className="form-note">{t('iso27001.form.step1note')}</p>

                    <div className="convo">
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelName')}</span>
                        <span
                          className="convo-fill"
                          style={invalidStyle('nombre')}
                        >
                          <input
                            type="text"
                            name="nombre"
                            placeholder={t('iso27001.form.placeholderName')}
                            autoComplete="name"
                            value={values.nombre}
                            ref={(el) => (inputRefs.current.nombre = el)}
                            onChange={(e) => setField('nombre', e.target.value)}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelCompany')}</span>
                        <span
                          className="convo-fill"
                          style={invalidStyle('empresa')}
                        >
                          <input
                            type="text"
                            name="empresa"
                            placeholder={t('iso27001.form.placeholderCompany')}
                            autoComplete="organization"
                            value={values.empresa}
                            ref={(el) => (inputRefs.current.empresa = el)}
                            onChange={(e) =>
                              setField('empresa', e.target.value)
                            }
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelSector')}</span>
                        <span className="convo-fill">
                          <input
                            type="text"
                            name="sector"
                            placeholder={t('iso27001.form.placeholderSector')}
                            value={values.sector}
                            onChange={(e) => setField('sector', e.target.value)}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelRole')}</span>
                        <span className="convo-fill">
                          <input
                            type="text"
                            name="cargo"
                            placeholder={t('iso27001.form.placeholderRole')}
                            autoComplete="organization-title"
                            value={values.cargo}
                            onChange={(e) => setField('cargo', e.target.value)}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="step-nav">
                      <span className="step-nav-spacer" />
                      <button
                        type="button"
                        className="btn step-next"
                        onClick={() => goNext(2)}
                      >
                        {t('iso27001.form.next')}
                      </button>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className={`form-step${step === 2 ? ' is-active' : ''}`}>
                    <h3>{t('iso27001.form.step2h3')}</h3>
                    <p className="form-note">{t('iso27001.form.step2note')}</p>

                    <div className="convo">
                      <div className="convo-field convo-field--stack">
                        <span className="convo-label">{t('iso27001.form.needLabel')}</span>
                        <div
                          className="chip-row"
                          role="radiogroup"
                          aria-label={t('iso27001.form.step2h3')}
                          ref={chipRowRef}
                        >
                          {[
                            ['implantacion', t('iso27001.form.chip1')],
                            ['certificacion', t('iso27001.form.chip2')],
                            ['implantacion-certificacion', t('iso27001.form.chip3')],
                            ['no-seguro', t('iso27001.form.chip4')],
                          ].map(([value, label]) => (
                            <label className="chip" key={value}>
                              <input
                                type="radio"
                                name="necesitas"
                                value={value}
                                checked={values.necesitas === value}
                                onChange={(e) =>
                                  setField('necesitas', e.target.value)
                                }
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="step-nav">
                      <button
                        type="button"
                        className="btn step-prev"
                        aria-label={t('iso27001.form.back')}
                        onClick={() => setStep(1)}
                      >
                        {t('iso27001.form.back')}
                      </button>
                      <button
                        type="button"
                        className="btn step-next"
                        onClick={() => goNext(3)}
                      >
                        {t('iso27001.form.next')}
                      </button>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className={`form-step${step === 3 ? ' is-active' : ''}`}>
                    <h3>{t('iso27001.form.step3h3')}</h3>
                    <p className="form-note">{t('iso27001.form.step3note')}</p>

                    <div className="convo">
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelEmail')}</span>
                        <span className="convo-fill">
                          <input
                            type="email"
                            name="email"
                            placeholder="nombre@tuempresa.com"
                            autoComplete="email"
                            value={values.email}
                            ref={(el) => (inputRefs.current.email = el)}
                            onChange={(e) => {
                              setField('email', e.target.value);
                              setContactHint(false);
                            }}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">{t('iso27001.form.labelPhone')}</span>
                        <span className="convo-fill">
                          <input
                            type="tel"
                            name="telefono"
                            placeholder="+34 ___ ___ ___"
                            autoComplete="tel"
                            value={values.telefono}
                            onChange={(e) => {
                              setField('telefono', e.target.value);
                              setContactHint(false);
                            }}
                          />
                        </span>
                      </div>
                    </div>

                    {contactHint && (
                      <p
                        className="contact-hint"
                        dangerouslySetInnerHTML={{ __html: t('iso27001.form.contactHint') }}
                      />
                    )}

                    <div className="step-nav">
                      <button
                        type="button"
                        className="btn step-prev"
                        aria-label={t('iso27001.form.back')}
                        onClick={() => setStep(2)}
                      >
                        {t('iso27001.form.back')}
                      </button>
                      <button
                        type="submit"
                        className="btn is-wide step-submit"
                        style={{ justifyContent: 'center' }}
                      >
                        {t('iso27001.form.submit')}
                      </button>
                    </div>
                    <p className="form-legal">
                      {t('iso27001.form.legal', {
                        defaultValue: '',
                      }).split('<a>')[0]}
                      <Link to={policyPath}>
                        {t('iso27001.form.legal').split('<a>')[1]?.split('</a>')[0]}
                      </Link>
                      {t('iso27001.form.legal').split('</a>')[1]}
                    </p>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className="success visible" aria-live="polite">
                <div className="success-mark">
                  <svg viewBox="0 0 24 24">
                    <polyline points="4,12 10,18 20,6" />
                  </svg>
                </div>
                <h3>{t('iso27001.form.successTitle')}</h3>
                <p>{t('iso27001.form.successP')}</p>
                <a
                  href="https://calendly.com/gigson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn is-wide"
                >
                  {t('iso27001.form.successCta')}
                </a>
                <p className="success-soft">{t('iso27001.form.successSoft')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Iso27001;
