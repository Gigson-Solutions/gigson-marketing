'use client';

import './ConsultoriaOdoo.css';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link, useRouter } from '../../../../i18n/navigation';
import { getAttribution } from '../../../lib/attribution';
import { submitLead } from '../../../lib/leads/submitLead';
import { Button, ButtonLink } from '../../../shared/ui/Button';
import FeatureGrid from '../../../shared/ui/FeatureGrid';
import ProcessSteps from '../../../shared/ui/ProcessSteps';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';
import StatsBar from '../../../shared/ui/StatsBar';
import { ODOO_INTEGRATION_LOGOS } from '../Integrations/data/integrationLogos';
import IntegrationLogosGrid from '../Integrations/IntegrationLogosGrid';

/*
 * Landing de campaña "Consultoría e implantación de Odoo".
 * Solo en castellano (los textos van aquí y no en messages/*.json porque la
 * página no tiene versión en inglés). El formulario envía a /api/lead con
 * form_id "consultoria-odoo" (ver src/lib/leads/forms.ts) y, si va bien,
 * redirige a la página de gracias común de la web (/es/gracias).
 *
 * Está montada con las mismas piezas que las páginas de servicio de la web
 * (/es/integraciones-odoo, /es/erp-a-medida): StatsBar, FeatureGrid,
 * ProcessSteps, ServiceFaq, IntegrationLogosGrid y los botones compartidos,
 * más las utilidades Tailwind del tema (text-h1, text-subtitle, px-landing…).
 * Así hereda tipografía, colores y espaciado del sistema de diseño en vez de
 * redefinirlos. Lo único propio es el formulario del hero y el CTA fijo de
 * móvil (ConsultoriaOdoo.css), ambos sobre tokens --gs-*.
 */

const PUNTOS = [
  { value: 'nuevo', label: 'Quiero implantar Odoo por primera vez' },
  { value: 'existente', label: 'Ya uso Odoo y necesito mejorarlo' },
  { value: 'migracion', label: 'Vengo de Holded, Sage, SAP u otro ERP' },
] as const;

type Punto = (typeof PUNTOS)[number]['value'];

const STATS = [
  { value: '+320', label: 'implantaciones de Odoo entregadas' },
  { value: '+20', label: 'herramientas conectadas con Odoo' },
  { value: '2', label: 'ERPs de los que somos partner oficial' },
];

const HERO_BULLETS = [
  '+320 implantaciones de Odoo entregadas.',
  'Partner oficial de Odoo y de Holded: conocemos los dos lados de la migración.',
  'Equipo técnico propio para módulos a medida e integraciones.',
];

const NUEVO = [
  [
    'Diagnóstico de procesos',
    'Qué módulos necesitas, Community o Enterprise y en qué orden ponerlos en marcha.',
  ],
  [
    'Configuración y localización española',
    'Plan contable, impuestos, SII y facturación electrónica preparados desde el primer día.',
  ],
  [
    'Migración de datos',
    'Clientes, productos, stock e histórico contable desde Holded, Sage, SAP o Excel.',
  ],
  ['Integraciones', 'Tu tienda online, transportistas, CRM o plataformas EDI de tus clientes.'],
  [
    'Formación y arranque acompañado',
    'Formamos a cada área con sus propios casos y estamos contigo las primeras semanas.',
  ],
];

const EXISTENTE = [
  [
    'Auditoría de tu instancia',
    'Revisamos configuración, desarrollos a medida y uso real para decidir qué se mantiene y qué se corrige.',
  ],
  ['Rescate de implantaciones atascadas', 'Retomamos el proyecto donde se quedó, sin empezar de nuevo.'],
  [
    'Cambio de partner',
    'Asumimos el soporte de tu Odoo con todo su histórico y documentamos lo que nadie documentó.',
  ],
  [
    'Actualización de versión',
    'Migramos a una versión actual o de Community a Enterprise, probando antes en un entorno separado.',
  ],
  [
    'Mejoras y soporte continuo',
    'Nuevos módulos, automatizaciones, informes y desarrollos que tu equipo pueda mantener.',
  ],
];

const SENALES = [
  '“Facturamos en un sitio, el stock va en Excel y nada cuadra a fin de mes.”',
  '“Holded nos ha servido, pero ya no llega para almacén y fabricación.”',
  '“Pagamos Odoo, pero el equipo sigue trabajando por fuera.”',
  '“Nuestro partner ya no responde y hay desarrollos que nadie sabe tocar.”',
];

const MODULOS = [
  {
    title: 'Contabilidad y facturación',
    description: 'Multiempresa, multidivisa, conciliación bancaria y localización española.',
  },
  {
    title: 'Inventario y almacén',
    description: 'Multialmacén, códigos de barras, lotes y reglas de reabastecimiento.',
  },
  {
    title: 'Fabricación (MRP)',
    description: 'Listas de materiales, órdenes de trabajo y control de calidad.',
  },
  {
    title: 'Ventas y CRM',
    description: 'Pipeline, presupuestos y pedidos conectados con el resto del ERP.',
  },
  { title: 'Compras', description: 'Proveedores, acuerdos de precio y aprobaciones por importe.' },
  {
    title: 'Ecommerce y TPV',
    description: 'Tienda propia o Shopify, WooCommerce y PrestaShop con stock sincronizado.',
  },
  {
    title: 'Proyectos y partes de horas',
    description: 'Seguimiento de horas, rentabilidad por proyecto y facturación por hitos.',
  },
  {
    title: 'Módulos a medida',
    description: 'Cuando el estándar no llega, lo desarrollamos sin romper las actualizaciones.',
  },
];

const ORIGENES = [
  'Holded',
  'Sage',
  'SAP Business One',
  'Microsoft Dynamics',
  'A3',
  'Excel y hojas de cálculo',
  'Versiones antiguas de Odoo',
];

const PASOS = [
  {
    title: 'Diagnóstico o auditoría',
    description:
      'Analizamos procesos, herramientas y, si ya tienes Odoo, su estado real. Sin coste.',
  },
  {
    title: 'Diseño funcional y presupuesto',
    description:
      'Documentamos cómo funcionará cada proceso en Odoo y lo dividimos en fases con alcance claro.',
  },
  {
    title: 'Configuración en pruebas',
    description:
      'Montamos Odoo, migramos datos y desarrollamos en un entorno separado de tu operativa.',
  },
  {
    title: 'Validación y formación',
    description:
      'Tu equipo prueba con pedidos, facturas y stock reales y aprende sobre su propio Odoo.',
  },
  {
    title: 'Arranque y soporte',
    description: 'Pasamos a producción y seguimos contigo para ajustar lo que haga falta.',
  },
];

const FAQS = [
  {
    question: '¿Cuánto cuesta implantar Odoo?',
    answer:
      'Depende de los módulos, el número de usuarios, la migración de datos y las integraciones. Tras el diagnóstico te damos un presupuesto por fases, para que sepas qué incluye cada una antes de empezar.',
  },
  {
    question: '¿Cuánto tarda una implantación?',
    answer:
      'Lo definimos en el diagnóstico según el alcance. Trabajar por fases permite tener en marcha lo más urgente, como facturación o almacén, sin esperar al proyecto completo.',
  },
  {
    question: '¿Os podéis hacer cargo de un Odoo que implantó otro partner?',
    answer:
      'Sí. Empezamos con una auditoría de la configuración y de los desarrollos a medida, y a partir de ahí asumimos el soporte y las mejoras.',
  },
  {
    question: '¿Se pierden datos al actualizar de versión o migrar desde otro ERP?',
    answer:
      'No. Hacemos la migración primero en un entorno de pruebas, la validas con tu equipo y solo entonces se pasa a producción.',
  },
  {
    question: '¿Odoo Community o Enterprise?',
    answer:
      'Depende de los módulos y de la localización fiscal que necesites. Te lo recomendamos en el diagnóstico con el coste de licencias de cada opción.',
  },
  {
    question: '¿Odoo cumple con la normativa fiscal española?',
    answer:
      'Configuramos la localización española: plan contable, impuestos, SII y facturación electrónica, incluida la adaptación a Verifactu.',
  },
];

const DISCLAIMER =
  'Gigson Solutions es una entidad independiente y no está afiliada ni forma parte de Odoo S.A. No representamos a Odoo ni actuamos en su nombre. Nuestra condición es exclusivamente la de partner oficial autorizado para la implementación y asesoramiento sobre sus productos y servicios.';

// Misma etiqueta que el badge del hero y las pills de FeatureGrid.
const PILL =
  'inline-block text-purple-accents text-smallTag uppercase tracking-widest border border-purple-accents rounded-full px-4 py-1';

const Bullet = ({ title, text }: { title?: string; text: string }) => (
  <li className="flex items-start gap-3">
    <span className="mt-2 w-2 h-2 rounded-full bg-purple-accents flex-shrink-0" aria-hidden="true" />
    <span className="flex flex-col gap-1">
      {title && <span className="text-body text-dark-primary">{title}</span>}
      <span className={`text-body ${title ? 'text-dark-medium' : 'text-dark-primary'}`}>{text}</span>
    </span>
  </li>
);

const ConsultoriaOdoo = () => {
  const locale = useLocale();
  const router = useRouter();
  // Estados de envío compartidos con el resto de formularios de la web.
  const tForm = useTranslations('form');

  const [values, setValues] = useState({
    punto: 'nuevo' as Punto,
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    mensaje: '',
    rgpd: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<null | 'error' | 'rateLimited'>(null);
  // Antispam: honeypot + tiempo mínimo de rellenado (lo comprueba /api/lead).
  const [honeypot, setHoneypot] = useState('');
  const [renderedAt] = useState(() => Date.now());

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitLead({
        form_id: 'consultoria-odoo',
        locale: locale === 'en' ? 'en' : 'es',
        page_path: window.location.pathname,
        name: values.nombre,
        company: values.empresa,
        email: values.email,
        phone: values.telefono,
        message: values.mensaje,
        fields: {
          punto: PUNTOS.find((p) => p.value === values.punto)?.label ?? values.punto,
        },
        attribution: getAttribution(),
        rgpd: values.rgpd,
        company_website: honeypot,
        rendered_at: renderedAt,
      });
      if (result !== 'sent') {
        setSubmitError(result);
        return;
      }
      // Página de gracias común a todos los formularios. Su visita puede usarse
      // como conversión (PageViewTracker envía el page_view en la navegación).
      router.push({ pathname: '/thank-you', query: { form: 'consultoria-odoo' } });
    } catch (error) {
      console.error('Consultoría Odoo lead submit failed', error);
      setSubmitError('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="codoo">
      {/* ── Hero + formulario ─────────────────────────────────────── */}
      <section className="px-landing mt-fixed-navbar bg-[#f4f3ef]">
        <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch lg:items-start pt-14 lg:pt-20 pb-14 lg:pb-20">
          <div className="flex-1 flex flex-col items-start">
            <span className={`${PILL} mb-6`}>Partner oficial de Odoo</span>
            <h1 className="text-h1 max-sm:text-[2.5rem] text-dark-primary mb-4 break-words">
              Consultoría e implantación de Odoo. Desde cero o sobre el que ya tienes.
            </h1>
            <p className="text-subtitle text-dark-medium mb-8">
              Diseñamos Odoo alrededor de cómo trabaja tu empresa, migramos tus datos y lo
              conectamos con tus herramientas. Si ya usas Odoo y no rinde como esperabas, lo
              auditamos y lo ponemos a trabajar.
            </p>
            <ul className="flex flex-col gap-4 mb-10">
              {HERO_BULLETS.map((text) => (
                <Bullet key={text} text={text} />
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <ButtonLink link="#nuevo" text="Ver proyecto nuevo" outlined className="uppercase" />
              <ButtonLink link="#existente" text="Ver si ya tengo Odoo" outlined className="uppercase" />
            </div>
          </div>

          <form
            id="contacto"
            className="codoo-form w-full lg:max-w-[33rem] bg-white rounded-[30px] p-6 lg:p-10 flex flex-col gap-6"
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
              <h2 className="text-h3 text-dark-primary">Pide tu diagnóstico sin coste</h2>
              <p className="text-body text-dark-medium">Un consultor de Odoo te llama en un día laborable.</p>
            </div>

            <fieldset className="codoo-fieldset">
              <legend className="text-body text-dark-primary mb-3">¿En qué punto estás?</legend>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {PUNTOS.map((p) => (
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
                <label htmlFor="codoo-nombre">Nombre</label>
                <input
                  id="codoo-nombre"
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
                <label htmlFor="codoo-empresa">Empresa</label>
                <input
                  id="codoo-empresa"
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
                <label htmlFor="codoo-email">Email de empresa</label>
                <input
                  id="codoo-email"
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
                <label htmlFor="codoo-telefono">Teléfono</label>
                <input
                  id="codoo-telefono"
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
                <label htmlFor="codoo-mensaje">
                  Qué necesitas resolver <span className="text-dark-medium">(opcional)</span>
                </label>
                <textarea
                  id="codoo-mensaje"
                  name="message"
                  rows={2}
                  maxLength={5000}
                  placeholder="Por ejemplo: facturamos en Holded y el stock va en Excel"
                  value={values.mensaje}
                  onChange={(e) => set('mensaje', e.target.value)}
                />
              </div>
            </div>

            <div className="codoo-consent">
              <input
                type="checkbox"
                id="codoo-rgpd"
                name="rgpd"
                required
                checked={values.rgpd}
                onChange={(e) => set('rgpd', e.target.checked)}
              />
              <label htmlFor="codoo-rgpd" className="text-smallTag text-dark-primary">
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
                {tForm(submitError === 'rateLimited' ? 'errorRateLimit' : 'error')}
              </p>
            )}

            <Button
              type="submit"
              name={submitting ? tForm('sending') : 'SOLICITAR DIAGNÓSTICO'}
              className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            />
            <p className="text-smallTag text-dark-medium text-center">
              Sin compromiso. Solo usamos tus datos para responder a tu solicitud.
            </p>
          </form>
        </div>
      </section>

      {/* CTA fijo en móvil (solo esta landing) */}
      <a
        href="#contacto"
        className="codoo-sticky bg-purple-accents text-white text-button rounded-full uppercase hover:opacity-80 transition duration-200"
      >
        Solicitar diagnóstico
      </a>

      {/* ── Credenciales ─────────────────────────────────────────── */}
      <StatsBar stats={STATS} />

      {/* ── Dos puntos de partida ────────────────────────────────── */}
      <section id="punto-de-partida" className="px-landing py-14 lg:py-20 bg-[#f4f3ef]">
        <div className="max-w-[88.875rem] mx-auto">
          <div className="max-w-[45rem] mb-10 lg:mb-14">
            <p className="text-purple-accents text-smallTag uppercase tracking-widest mb-4">
              Dos puntos de partida
            </p>
            <h2 className="text-h2 text-dark-primary mb-4">
              Dos puntos de partida, el mismo objetivo: un Odoo que tu equipo use de verdad.
            </h2>
            <p className="text-subtitle text-dark-medium">
              No es lo mismo empezar en blanco que heredar una instalación. Por eso el trabajo
              arranca distinto en cada caso.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article
              id="nuevo"
              className="bg-white rounded-[30px] p-8 lg:p-10 flex flex-col gap-6 border border-transparent hover:border-purple-accents transition duration-200"
            >
              <span className={`${PILL} self-start`}>Proyecto nuevo</span>
              <h3 className="text-h3 text-dark-primary">Implantamos Odoo desde cero</h3>
              <p className="text-subtitle text-dark-medium">
                Para empresas que trabajan con varias herramientas sueltas, hojas de cálculo o un
                ERP que se ha quedado pequeño.
              </p>
              <ul className="flex flex-col gap-4">
                {NUEVO.map(([title, text]) => (
                  <Bullet key={title} title={title} text={text} />
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <ButtonLink
                  link="#contacto"
                  text="Quiero implantar Odoo"
                  className="uppercase"
                  onClick={() => set('punto', 'nuevo')}
                />
              </div>
            </article>

            <article
              id="existente"
              className="bg-white rounded-[30px] p-8 lg:p-10 flex flex-col gap-6 border border-transparent hover:border-purple-accents transition duration-200"
            >
              <span className={`${PILL} self-start`}>Ya tengo Odoo</span>
              <h3 className="text-h3 text-dark-primary">Revisamos, rescatamos y hacemos crecer tu Odoo</h3>
              <p className="text-subtitle text-dark-medium">
                Para empresas con una implantación a medias, un partner que ya no responde o una
                versión que se ha quedado atrás.
              </p>
              <ul className="flex flex-col gap-4">
                {EXISTENTE.map(([title, text]) => (
                  <Bullet key={title} title={title} text={text} />
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <ButtonLink
                  link="#contacto"
                  text="Revisar mi Odoo"
                  className="uppercase"
                  onClick={() => set('punto', 'existente')}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Señales ──────────────────────────────────────────────── */}
      <section aria-labelledby="t-senales" className="px-landing py-14 lg:py-20 bg-white">
        <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row lg:gap-20">
          <div className="lg:w-[28rem] flex-shrink-0 mb-10 lg:mb-0">
            <p className="text-purple-accents text-smallTag uppercase tracking-widest mb-4">
              Señales
            </p>
            <h2 id="t-senales" className="text-h2 text-dark-primary mb-4">
              Si te reconoces en alguna de estas frases, hablemos.
            </h2>
            <p className="text-subtitle text-dark-medium">
              Son las situaciones que más vemos en la primera llamada.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {SENALES.map((q) => (
              <blockquote
                key={q}
                className="bg-[#f4f3ef] rounded-[30px] p-6 lg:p-8 text-h4 text-dark-primary m-0"
              >
                {q}
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Módulos ──────────────────────────────────────────────── */}
      <FeatureGrid
        id="modulos"
        eyebrow="Módulos"
        title="Los módulos que más implantamos"
        description="Empezamos por los que más impacto tienen en tu operativa y añadimos el resto por fases."
        features={MODULOS}
      />

      {/* ── Migración ────────────────────────────────────────────── */}
      <section id="migracion" aria-labelledby="t-migracion" className="px-landing py-14 lg:py-20 bg-white">
        <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row lg:gap-20 lg:items-start">
          <div className="flex-1 max-w-[45rem]">
            <p className="text-purple-accents text-smallTag uppercase tracking-widest mb-4">
              Migración
            </p>
            <h2 id="t-migracion" className="text-h2 text-dark-primary mb-4">
              ¿Vienes de Holded u otro ERP? Te llevamos a Odoo sin perder histórico.
            </h2>
            <p className="text-subtitle text-dark-medium">
              Somos partner de Holded y de Odoo, así que sabemos qué datos se mueven tal cual,
              cuáles hay que transformar y qué conviene dejar atrás. Cargamos primero en un
              entorno de prueba y validas tú antes del cambio.
            </p>
          </div>
          <ul className="flex-1 flex flex-wrap gap-3 mt-8 lg:mt-0 lg:justify-end lg:pt-12 m-0 p-0">
            {ORIGENES.map((o) => (
              <li key={o} className={PILL}>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Proceso ──────────────────────────────────────────────── */}
      <div id="proceso">
        <ProcessSteps
          eyebrow="Cómo trabajamos"
          h2a="Cómo trabajamos"
          h2b="un proyecto de Odoo."
          lead="El mismo método para un proyecto nuevo y para uno heredado. En los heredados, el paso uno es una auditoría."
          steps={PASOS}
        />
      </div>

      {/* ── Integraciones: misma rejilla y datos que /es/integraciones-odoo ── */}
      <div id="integraciones">
        <IntegrationLogosGrid namespace="integrations-odoo" logos={ODOO_INTEGRATION_LOGOS} />
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <div id="faq">
        <ServiceFaq title="Preguntas frecuentes" faqs={FAQS} />
      </div>

      {/* ── CTA final ────────────────────────────────────────────── */}
      <section className="px-landing py-14 lg:py-20 bg-white">
        <div className="max-w-[45rem] mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-h2 text-dark-primary">
            Empieza con un diagnóstico de tu Odoo, nuevo o existente.
          </h2>
          <p className="text-subtitle text-dark-medium">
            Sin coste ni compromiso. Sales de la llamada sabiendo qué harías primero.
          </p>
          <ButtonLink link="#contacto" text="Solicitar diagnóstico" className="uppercase" />
        </div>
      </section>

      {/* ── Aviso de independencia respecto a Odoo S.A. ─────────── */}
      <section className="px-landing bg-[#f4f3ef]">
        <div className="max-w-[88.875rem] mx-auto">
          <p className="text-smallTag text-dark-medium py-14 lg:py-20">{DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
};

export default ConsultoriaOdoo;
