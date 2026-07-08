import './Iso27001.css';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { DEFAULT_LANG, ROUTE_SLUGS } from '../../../router/routerSlugs';
import { SeoHelmet } from '../../../seo/seoHelmet';

const TOTAL_STEPS = 3;

const Iso27001 = () => {
  const { i18n } = useTranslation();
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
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmail = values.email.trim().length > 0;
    const hasTel = values.telefono.trim().length > 0;
    if (!hasEmail && !hasTel) {
      setContactHint(true);
      inputRefs.current.email?.focus();
      return;
    }
    setContactHint(false);
    setSending(true);
    setSubmitError(false);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_ISO27001_FORM_KEY,
          subject: 'Nuevo lead ISO 27001 — diagnóstico gratuito',
          from_name: 'gigson solutions · ISO 27001',
          name: values.nombre,
          email: values.email || '(sin email)',
          phone: values.telefono || '(sin teléfono)',
          empresa: values.empresa,
          sector: values.sector || '(no indicado)',
          cargo: values.cargo || '(no indicado)',
          necesitas: values.necesitas,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error('submit failed');
      setSubmitted(true);
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      setSubmitError(true);
    } finally {
      setSending(false);
    }
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
        title="Certificación ISO 27001 para empresas tecnológicas · gigson solutions"
        description="Implantamos tu SGSI ISO 27001 sobre tu operativa real, sin burocracia. Diagnóstico gratuito en 24 h para pymes, despachos y consultoras."
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-mesh" />
        <div className="hero-grid" />
        <div className="hero-shape">
          <div className="d3 d3-sphere" />
        </div>

        <div className="hero-wrap">
          <div className="hero-inner">
            <span className="hero-tag">
              <b>ISO/IEC 27001:2022</b> · Seguridad de la información
            </span>
            <h1>
              Te están obligando
              <br />a certificarte en
              <br />
              <em className="accent-italic">ISO 27001</em>.<br />
              Te lo resolvemos.
            </h1>
            <p className="hero-sub">
              Implantamos un Sistema de Gestión de Seguridad de la Información
              (SGSI) sobre tu operativa real — no documentación que nadie va a
              usar. Para empresas pequeñas y medianas — un despacho de abogados,
              una consultora, una agencia, una pyme tecnológica — que necesitan
              el certificado sin paralizar su día a día.
            </p>
            <div className="hero-pills">
              <span className="pill">Controles técnicos reales</span>
              <span className="pill">
                Sistema mínimo viable, sin burocracia
              </span>
              <span className="pill pill--accent">
                Diagnóstico gratuito en 24 h
              </span>
            </div>
            <div className="hero-cta-row">
              <a href="#form" className="btn is-wide" onClick={scrollToForm}>
                Solicita tu diagnóstico gratuito
              </a>
              <span className="hero-note">
                <b>Sin compromiso</b> · Te decimos qué controles ya cumples sin
                saberlo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust">
        <div className="trust-inner">
          <span className="trust-label">Trabajamos con</span>
          <div className="trust-items">
            <span className="trust-item">Despachos y consultoras</span>
            <span className="trust-item">Pymes tecnológicas de 10 a 250</span>
            <span className="trust-item">
              Proveedores de empresas reguladas
            </span>
            <span className="trust-item">Empresas con clientes B2B</span>
          </div>
        </div>
      </div>

      {/* PAIN */}
      <section className="pain">
        <div className="pain-inner">
          <div className="section-head">
            <span className="eyebrow eyebrow--purple">Por qué ahora</span>
            <h2>
              Hay razones de peso
              <br />
              para certificarte <em className="accent-italic">ahora</em>.
            </h2>
          </div>
          <div className="pain-grid">
            <article className="card">
              <div className="card-num">01</div>
              <h3>Tu cliente lo exige para seguir trabajando contigo</h3>
              <p>
                Cada vez más empresas medianas y grandes incluyen ISO 27001 como
                requisito contractual para sus proveedores. No es opcional: o te
                certificas o pierdes el contrato.
              </p>
            </article>
            <article className="card">
              <div className="card-num">02</div>
              <h3>La licitación la puntúa o la exige directamente</h3>
              <p>
                En concursos públicos y privados, tener ISO 27001 suma puntos o
                es requisito de admisión. Competir sin ella significa ceder
                terreno a quienes ya la tienen.
              </p>
            </article>
            <article className="card">
              <div className="card-num">03</div>
              <h3>Cada venta se atasca en un cuestionario de seguridad</h3>
              <p>
                Tus clientes —sobre todo si están regulados o tienen NIS2
                detrás— te envían cuestionarios de seguridad cada vez más
                exigentes. Sin ISO 27001 cada cuestionario es semanas de
                trabajo; con ella, una sola respuesta.
              </p>
            </article>
            <article className="card">
              <div className="card-num">04</div>
              <h3>Tu competencia ya la tiene</h3>
              <p>
                Más de 3.000 empresas españolas están certificadas en ISO 27001.
                En cada vez más sectores la certificación ya es un estándar de
                facto — no un diferencial.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* DIFFERENTIAL */}
      <section className="diff">
        <div className="diff-inner">
          <div className="diff-slab">
            <div className="section-head">
              <span className="eyebrow eyebrow--oncream">Nuestro enfoque</span>
              <h2>
                ISO 27001 implantada
                <br />
                con <em style={{ fontStyle: 'italic' }}>rigor técnico</em>.
              </h2>
              <p className="lead">
                La mayoría de consultoras ISO redactan documentos. Nosotros
                implementamos los controles sobre tu operativa real, los
                sistemas, accesos y procesos que ya usas cada día, y te dejamos
                un SGSI que funciona, no uno que solo pasa la auditoría.
              </p>
            </div>
            <div className="diff-grid">
              <div className="diff-item">
                <span className="diff-num">01</span>
                <h3>Controles reales, no solo documentación</h3>
                <p>
                  Evaluamos cómo funciona tu empresa de verdad — sistemas,
                  accesos, datos, proveedores, procesos críticos — e
                  implementamos los controles del Anexo A sobre lo que ya
                  tienes.
                </p>
              </div>
              <div className="diff-item">
                <span className="diff-num">02</span>
                <h3>Un sistema mínimo viable, fácil de sostener</h3>
                <p>
                  Sabemos que muchas empresas no tienen responsable de seguridad
                  — ni equipo de IT, en algunos casos. Diseñamos el SGSI más
                  sencillo que pasa la auditoría: sin burocracia innecesaria,
                  fácil de mantener aunque la seguridad la lleve quien ya tiene
                  cinco cosas en la mano.
                </p>
              </div>
              <div className="diff-item">
                <span className="diff-num">03</span>
                <h3>Sabemos qué es certificable y qué no</h3>
                <p>
                  No te venderemos que te certifiques en todo. NIS2, por
                  ejemplo, no es una certificación — es cumplimiento; ISO 27001
                  sí lo es. Te explicamos exactamente qué necesitas según tu
                  situación, sin sobreingeniería ni papel innecesario.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="section-head">
            <span className="eyebrow eyebrow--purple">Cómo trabajamos</span>
            <h2>
              Cuatro fases,
              <br />
              un certificado.
            </h2>
            <p className="lead" style={{ maxWidth: '38ch' }}>
              Un proceso pensado para pymes: diagnóstico de tu operativa real,
              implantación sobre lo que ya tienes y coordinación de la
              certificadora — sin paralizar tu día a día.
            </p>
          </div>

          <div
            className={`steps${revealed ? ' is-revealed' : ''}`}
            ref={stepsRef}
          >
            <div className="step">
              <div className="step-num">01</div>
              <h4>Diagnóstico</h4>
              <p>
                Gap analysis de tu situación actual. Identificamos qué controles
                ya cumples sin saberlo y qué falta realmente.
              </p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h4>Implantación</h4>
              <p>
                Documentación, análisis de riesgos, controles operativos sobre
                lo que ya tienes y formación al equipo implicado.
              </p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>Auditoría interna</h4>
              <p>
                Verificación previa para que llegues a la auditoría externa con
                la certificación asegurada.
              </p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h4>Certificación</h4>
              <p>
                Coordinamos las auditorías de fase 1 y fase 2 con la entidad
                certificadora. Certificado ISO 27001 obtenido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="formsec" id="form" ref={formSectionRef}>
        <div className="formsec-inner">
          <div className="formsec-left">
            <span className="eyebrow eyebrow--purple">
              Diagnóstico gratuito
            </span>
            <h2 style={{ marginTop: '18px' }}>
              Te decimos qué controles
              <br />
              de ISO 27001{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gs-purple)' }}>
                ya cumples
              </em>{' '}
              sin saberlo.
            </h2>
            <p className="lead">
              Si te están empujando a certificarte —un cliente, una licitación,
              un cuestionario de seguridad que no para de crecer— probablemente
              ya cumples más controles de los que crees. Sea un despacho de
              abogados, una consultora o una pyme tecnológica, cuéntanos tu
              situación y te lo aterrizamos.
            </p>

            <div className="deliver-block">
              <div className="deliver">
                <span className="deliver-tag">El diagnóstico gratuito</span>
                <p>
                  Revisamos tu operativa actual y te enviamos por escrito{' '}
                  <b>qué controles de ISO 27001 ya cumples</b> y cuáles te
                  faltan. Sin compromiso.
                </p>
              </div>
              <div className="deliver">
                <span className="deliver-tag">
                  La llamada posterior{' '}
                  <span className="deliver-tag-soft">(opcional)</span>
                </span>
                <p>
                  Si quieres ir más allá, en 30 minutos te damos{' '}
                  <b>plazo y coste ajustados a tu empresa</b> y te explicamos si
                  NIS2 te afecta y cómo se relaciona con la ISO 27001.
                </p>
              </div>
            </div>
          </div>

          <div className="form-card" ref={formCardRef}>
            {!submitted && (
              <div id="form-content">
                <div className="formtag">
                  Diagnóstico gratuito · Paso {step} de {TOTAL_STEPS}
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
                    <h3>Cuéntanos quién eres.</h3>
                    <p className="form-note">
                      Cuatro frases rápidas para entender a quién atendemos.
                    </p>

                    <div className="convo">
                      <div className="convo-field">
                        <span className="convo-label">Me llamo</span>
                        <span
                          className="convo-fill"
                          style={invalidStyle('nombre')}
                        >
                          <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre y apellidos"
                            autoComplete="name"
                            value={values.nombre}
                            ref={(el) => (inputRefs.current.nombre = el)}
                            onChange={(e) => setField('nombre', e.target.value)}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">y trabajo en</span>
                        <span
                          className="convo-fill"
                          style={invalidStyle('empresa')}
                        >
                          <input
                            type="text"
                            name="empresa"
                            placeholder="Nombre de la empresa"
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
                        <span className="convo-label">del sector</span>
                        <span className="convo-fill">
                          <input
                            type="text"
                            name="sector"
                            placeholder="Tecnología, despacho, consultora…"
                            value={values.sector}
                            onChange={(e) => setField('sector', e.target.value)}
                          />
                        </span>
                      </div>
                      <div className="convo-field">
                        <span className="convo-label">como</span>
                        <span className="convo-fill">
                          <input
                            type="text"
                            name="cargo"
                            placeholder="socio, gerente, responsable de IT…"
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
                        Siguiente →
                      </button>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className={`form-step${step === 2 ? ' is-active' : ''}`}>
                    <h3>¿Qué necesitas?</h3>
                    <p className="form-note">
                      Si todavía no lo tienes claro, no pasa nada — para eso es
                      el diagnóstico.
                    </p>

                    <div className="convo">
                      <div className="convo-field convo-field--stack">
                        <span className="convo-label">Necesito…</span>
                        <div
                          className="chip-row"
                          role="radiogroup"
                          aria-label="¿Qué necesitas?"
                          ref={chipRowRef}
                        >
                          {[
                            ['implantacion', 'Implantación'],
                            ['certificacion', 'Certificación'],
                            [
                              'implantacion-certificacion',
                              'Implantación + certificación',
                            ],
                            ['no-seguro', 'No estoy seguro'],
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
                        aria-label="Volver al paso anterior"
                        onClick={() => setStep(1)}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="btn step-next"
                        onClick={() => goNext(3)}
                      >
                        Siguiente →
                      </button>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className={`form-step${step === 3 ? ' is-active' : ''}`}>
                    <h3>¿Cómo te contactamos?</h3>
                    <p className="form-note">
                      Con un email o un teléfono nos vale. Te enviamos el
                      diagnóstico en menos de 24 h.
                    </p>

                    <div className="convo">
                      <div className="convo-field">
                        <span className="convo-label">Puedes escribirme a</span>
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
                        <span className="convo-label">o llamarme al</span>
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
                      <p className="contact-hint">
                        Necesitamos al menos un email <b>o</b> un teléfono para
                        hacerte llegar el diagnóstico.
                      </p>
                    )}

                    <div className="step-nav">
                      <button
                        type="button"
                        className="btn step-prev"
                        aria-label="Volver al paso anterior"
                        onClick={() => setStep(2)}
                      >
                        ←
                      </button>
                      <button
                        type="submit"
                        className="btn is-wide step-submit"
                        style={{ justifyContent: 'center' }}
                        disabled={sending}
                      >
                        {sending ? 'Enviando…' : 'Solicitar diagnóstico gratuito'}
                      </button>
                    </div>
                    {submitError && (
                      <p className="contact-hint">
                        No hemos podido enviar el formulario. Escríbenos directamente a{' '}
                        <a href="mailto:hello@gigsonsolutions.com">hello@gigsonsolutions.com</a>.
                      </p>
                    )}
                    <p className="form-legal">
                      Al enviar este formulario aceptas que gigson solutions se
                      ponga en contacto contigo en relación a tu solicitud. No
                      compartimos tus datos con terceros.{' '}
                      <Link to={policyPath}>Política de privacidad</Link>.
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
                <h3>Recibido. Te enviamos el diagnóstico en 24 h.</h3>
                <p>
                  Revisaremos tu situación y te enviaremos por escrito qué
                  controles de ISO 27001 ya cumples sin saberlo. Si quieres,
                  reserva ahora una llamada de 30 minutos para repasarlo y ver
                  plazo, coste y cómo te afecta NIS2.
                </p>
                <a
                  href="https://calendar.app.google/ZAYNg9onVuqktmxH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn is-wide"
                >
                  Reservar llamada →
                </a>
                <p className="success-soft">
                  O espera nuestro correo — te respondemos antes de 24 horas
                  laborables.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Iso27001;
