'use client';

// Reutiliza el formulario del hero y el CTA fijo de móvil de la landing de
// Odoo (clases .codoo-*), para que las tres landings de campaña se vean y se
// comporten igual. Lo propio de las ISO va en ConsultoriaIso.css.
import '../ConsultoriaOdoo/ConsultoriaOdoo.css';
import './ConsultoriaIso.css';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Link, useRouter } from '../../../../i18n/navigation';
import { getAttribution } from '../../../lib/attribution';
import { LEAD_ERROR_KEYS, submitLead } from '../../../lib/leads/submitLead';
import type { LeadResult } from '../../../lib/leads/types';
import Brand from '../../../shared/ui/Brand';
import { Button, ButtonLink } from '../../../shared/ui/Button';
import CostsTimeline from '../../../shared/ui/CostsTimeline';
import FeatureGrid from '../../../shared/ui/FeatureGrid';
import ProcessSteps from '../../../shared/ui/ProcessSteps';
import SelfAssessment, {
  type SelfAssessmentResult,
} from '../../../shared/ui/SelfAssessment';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';
import type { ConsultoriaIsoContent } from './types';

/*
 * Landings de campaña ISO 27001 e ISO 42001 (Google Ads).
 * Solo en castellano, noindex, y montadas como /es/consultoria-odoo: formulario
 * en el hero que envía a /api/lead y, si va bien, redirige a /es/gracias.
 * El autodiagnóstico no tiene formulario propio: su resultado viaja en el
 * campo "autodiagnostico" del formulario del hero.
 */

const PILL =
  'inline-block text-purple-accents text-smallTag uppercase tracking-widest border border-purple-accents rounded-full px-4 py-1';

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <span
      className="mt-2 w-2 h-2 rounded-full bg-purple-accents flex-shrink-0"
      aria-hidden="true"
    />
    <span className="text-body text-dark-primary">{text}</span>
  </li>
);

const ConsultoriaIso = ({ content: c }: { content: ConsultoriaIsoContent }) => {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('form');

  const [values, setValues] = useState({
    punto: c.form.puntos[0].value,
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    mensaje: '',
    rgpd: false,
  });
  const [quiz, setQuiz] = useState<SelfAssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<null | Exclude<
    LeadResult,
    'sent'
  >>(null);
  // Antispam: honeypot + tiempo mínimo de rellenado (lo comprueba /api/lead).
  const [honeypot, setHoneypot] = useState('');
  const [renderedAt] = useState(() => Date.now());

  // El CTA fijo de móvil solo aparece una vez pasado el formulario del hero:
  // en la primera pantalla tapaba el texto de presentación y repetía un
  // formulario que ya está a la vista.
  const formRef = useRef<HTMLFormElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const form = formRef.current;
    if (!form || !('IntersectionObserver' in globalThis)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const set = <K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const fields: Record<string, string> = {
        punto:
          c.form.puntos.find((p) => p.value === values.punto)?.label ??
          values.punto,
      };
      if (quiz) {
        fields.autodiagnostico = `${quiz.score}%. Puntos a reforzar: ${
          quiz.gaps.length > 0 ? quiz.gaps.join('; ') : 'ninguno'
        }`;
      }
      const result = await submitLead({
        form_id: c.formId,
        locale: locale === 'en' ? 'en' : 'es',
        page_path: window.location.pathname,
        name: values.nombre,
        company: values.empresa,
        email: values.email,
        phone: values.telefono,
        message: values.mensaje,
        fields,
        attribution: getAttribution(),
        rgpd: values.rgpd,
        company_website: honeypot,
        rendered_at: renderedAt,
      });
      if (result !== 'sent') {
        setSubmitError(result);
        return;
      }
      router.push({ pathname: '/thank-you', query: { form: c.formId } });
    } catch (error) {
      console.error('Consultoría ISO lead submit failed', error);
      setSubmitError('error');
    } finally {
      setSubmitting(false);
    }
  };

  const { panel } = c.scope;

  return (
    <div className="codoo ciso">
      {/* ── Hero + formulario ─────────────────────────────────────── */}
      <section className="px-landing mt-fixed-navbar bg-[#f4f3ef]">
        <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch lg:items-start pt-14 lg:pt-20 pb-14 lg:pb-20">
          <div className="flex-1 lg:flex-[1.2] flex flex-col items-start">
            <span className={`${PILL} mb-6`}>{c.pill}</span>
            <h1 className="codoo-h1 text-h1 max-sm:text-[2.5rem] text-dark-primary mb-4 break-words">
              {c.title}
            </h1>
            <p className="text-subtitle text-dark-medium mb-8">{c.subtitle}</p>
            <ul className="flex flex-col gap-4 mb-8">
              {c.bullets.map((text) => (
                <Bullet key={text} text={text} />
              ))}
            </ul>
            <ul
              className="flex flex-wrap gap-2 mb-10 p-0 m-0 list-none"
              aria-label="Para quién"
            >
              {c.audience.map((a) => (
                <li key={a} className="ciso-chip">
                  {a}
                </li>
              ))}
            </ul>
            <ButtonLink
              link="#autodiagnostico"
              text="Autodiagnóstico en 2 min"
              outlined
              className="uppercase"
            />
          </div>

          <form
            ref={formRef}
            id="contacto"
            className="codoo-form w-full lg:flex-1 lg:max-w-[31rem] bg-white rounded-[30px] p-6 lg:p-10 flex flex-col gap-6"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            {/* Honeypot: invisible para personas; /api/lead descarta lo que llegue relleno. */}
            <input
              type="text"
              name="company_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-h3 text-dark-primary">{c.form.title}</h2>
              <p className="text-body text-dark-medium">
                Un consultor te llama en un día laborable.
              </p>
            </div>

            {quiz && (
              <p className="ciso-quiz-notice" role="status">
                Adjuntaremos tu autodiagnóstico ({quiz.score}%) a la solicitud.
              </p>
            )}

            <fieldset className="codoo-fieldset">
              <legend className="text-body text-dark-primary mb-3">
                {c.form.puntoLegend}
              </legend>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {c.form.puntos.map((p) => (
                  <div key={p.value} className="codoo-choice">
                    <input
                      type="radio"
                      id={`punto-${p.value}`}
                      name="punto"
                      value={p.value}
                      checked={values.punto === p.value}
                      onChange={() => set('punto', p.value)}
                    />
                    <label htmlFor={`punto-${p.value}`}>{p.label}</label>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-5">
              <div className="codoo-field">
                <label htmlFor="ciso-nombre">Nombre</label>
                <input
                  id="ciso-nombre"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={200}
                  placeholder="Tu nombre"
                  value={values.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                />
              </div>
              <div className="codoo-field">
                <label htmlFor="ciso-empresa">Empresa</label>
                <input
                  id="ciso-empresa"
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  required
                  maxLength={200}
                  placeholder="Nombre de tu empresa"
                  value={values.empresa}
                  onChange={(e) => set('empresa', e.target.value)}
                />
              </div>
              <div className="codoo-field">
                <label htmlFor="ciso-email">Email de empresa</label>
                <input
                  id="ciso-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={320}
                  placeholder="nombre@empresa.com"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div className="codoo-field">
                <label htmlFor="ciso-telefono">Teléfono</label>
                <input
                  id="ciso-telefono"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={50}
                  placeholder="+34 600 000 000"
                  value={values.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                />
              </div>
              <div className="codoo-field codoo-field--stack">
                <label htmlFor="ciso-mensaje">
                  {c.form.messageLabel}{' '}
                  <span className="text-dark-medium">(opcional)</span>
                </label>
                <textarea
                  id="ciso-mensaje"
                  name="message"
                  rows={2}
                  maxLength={5000}
                  placeholder={c.form.messagePlaceholder}
                  value={values.mensaje}
                  onChange={(e) => set('mensaje', e.target.value)}
                />
              </div>
            </div>

            <div className="codoo-consent">
              <input
                type="checkbox"
                id="ciso-rgpd"
                name="rgpd"
                required
                checked={values.rgpd}
                onChange={(e) => set('rgpd', e.target.checked)}
              />
              <label
                htmlFor="ciso-rgpd"
                className="text-smallTag text-dark-primary"
              >
                He leído y acepto la{' '}
                <Link
                  href="/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-accents"
                >
                  política de privacidad
                </Link>
              </label>
            </div>

            {submitError && (
              <p className="codoo-form-error" role="alert">
                {tForm(LEAD_ERROR_KEYS[submitError])}
              </p>
            )}

            <Button
              type="submit"
              name={submitting ? tForm('sending') : 'SOLICITAR DIAGNÓSTICO'}
              className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            />
            <p className="text-smallTag text-dark-medium text-center">
              Sin compromiso. Solo usamos tus datos para responder a tu
              solicitud.
            </p>
          </form>
        </div>
      </section>

      {/* CTA fijo en móvil */}
      <a
        href="#contacto"
        aria-hidden={!showSticky}
        tabIndex={showSticky ? undefined : -1}
        className={`codoo-sticky${showSticky ? '' : ' is-hidden'} bg-purple-accents text-white text-button rounded-full uppercase hover:opacity-80 transition duration-200`}
      >
        Solicitar diagnóstico
      </a>

      {/* ── Clientes ─────────────────────────────────────────────── */}
      <Brand />

      {/* ── Por qué ahora ────────────────────────────────────────── */}
      <FeatureGrid
        id="por-que"
        eyebrow={c.why.eyebrow}
        title={c.why.title}
        description={c.why.description}
        features={c.why.items}
      />

      {/* ── Enfoque ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="t-enfoque"
        className="px-landing py-14 lg:py-20 bg-white"
      >
        <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row lg:gap-20">
          <div className="lg:w-[28rem] flex-shrink-0 mb-10 lg:mb-0">
            <p className="text-purple-accents text-smallTag uppercase tracking-widest mb-4">
              {c.approach.eyebrow}
            </p>
            <h2 id="t-enfoque" className="text-h2 text-dark-primary">
              {c.approach.title}
            </h2>
          </div>
          <ol className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 m-0 p-0 list-none">
            {c.approach.items.map((item, i) => (
              <li key={item.title} className="ciso-numbered">
                <span className="text-purple-accents text-body">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-h4 text-dark-primary">{item.title}</h3>
                <p className="text-body text-dark-medium">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Alcance + panel visual ───────────────────────────────── */}
      <section
        id="alcance"
        aria-labelledby="t-alcance"
        className="px-landing py-14 lg:py-20 bg-[#f4f3ef]"
      >
        <div className="max-w-[88.875rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-center mb-10 lg:mb-14">
            <div className="flex-1 max-w-[45rem]">
              <p className="text-purple-accents text-smallTag uppercase tracking-widest mb-4">
                {c.scope.eyebrow}
              </p>
              <h2 id="t-alcance" className="text-h2 text-dark-primary mb-4">
                {c.scope.title}
              </h2>
              <p className="text-subtitle text-dark-medium">{c.scope.lead}</p>
            </div>
            <div
              className="ciso-panel w-full lg:max-w-[28rem]"
              role="img"
              aria-label={panel.title}
            >
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-body text-dark-primary">
                  {panel.title}
                </span>
                <span className="ciso-tag">Ejemplo</span>
              </div>
              {panel.summary && (
                <div className="flex items-baseline gap-3">
                  <span className="ciso-big">{panel.summary.figure}</span>
                  <span className="text-smallTag text-dark-medium">
                    {panel.summary.text}
                  </span>
                </div>
              )}
              {panel.bars && (
                <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                  {panel.bars.map((b) => (
                    <li key={b.label} className="flex flex-col gap-2">
                      <span className="flex justify-between text-smallTag text-dark-primary">
                        <span>{b.label}</span>
                        <span className="text-dark-medium">{b.value}</span>
                      </span>
                      <span className="ciso-bar">
                        <span style={{ width: `${b.percent}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {panel.systems && (
                <ul className="flex flex-col m-0 p-0 list-none">
                  {panel.systems.map((s) => (
                    <li key={s.name} className="ciso-system">
                      <span className="text-smallTag text-dark-primary">
                        {s.name}
                      </span>
                      <span className={`ciso-risk ciso-risk--${s.level}`}>
                        {s.risk}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-smallTag text-dark-medium border-t border-[#e2e0dc] pt-4 m-0">
                {panel.caption}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.scope.blocks.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-[30px] p-6 lg:p-8 flex flex-col gap-2"
              >
                <span className="ciso-figure">{b.figure}</span>
                <h3 className="text-h4 text-dark-primary">{b.title}</h3>
                <p className="text-body text-dark-medium">{b.description}</p>
              </div>
            ))}
          </div>
          <ul
            className="flex flex-wrap gap-3 mt-8 m-0 p-0 list-none"
            aria-label="Entregables"
          >
            {c.scope.deliverables.map((d) => (
              <li key={d} className={PILL}>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Autodiagnóstico (su resultado viaja con el formulario del hero) ── */}
      <SelfAssessment
        {...c.selfAssessment}
        ctaHref="#contacto"
        onComplete={setQuiz}
      />

      {/* ── Proceso ──────────────────────────────────────────────── */}
      <div id="proceso">
        <ProcessSteps
          eyebrow={c.process.eyebrow}
          h2a={c.process.h2a}
          h2b={c.process.h2b}
          lead={c.process.lead}
          steps={c.process.steps}
        />
      </div>

      {/* ── Costes y plazos ──────────────────────────────────────── */}
      <CostsTimeline {...c.costs} />

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div id="faq">
        <ServiceFaq title="Preguntas frecuentes" faqs={c.faqs} />
      </div>

      {/* ── CTA final ────────────────────────────────────────────── */}
      <section className="px-landing py-14 lg:py-20 bg-white">
        <div className="max-w-[45rem] mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-h2 text-dark-primary">{c.final.title}</h2>
          <p className="text-subtitle text-dark-medium">{c.final.text}</p>
          <ButtonLink
            link="#contacto"
            text="Solicitar diagnóstico"
            className="uppercase"
          />
        </div>
      </section>

      {/* ── Aviso: Gigson no es entidad certificadora ───────────── */}
      <section className="px-landing bg-[#f4f3ef]">
        <div className="max-w-[88.875rem] mx-auto">
          <p className="text-smallTag text-dark-medium py-14 lg:py-20">
            {c.disclaimer}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ConsultoriaIso;
