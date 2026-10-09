'use client';

import './ConsultoriaOdoo.css';

import { useLocale } from 'next-intl';
import { useState } from 'react';

import { Link, useRouter } from '../../../../i18n/navigation';
import { getAttribution } from '../../../lib/attribution';
import { submitLead } from '../../../lib/leads/submitLead';

/*
 * Landing de campaña "Consultoría e implantación de Odoo".
 * Solo en castellano (los textos van aquí y no en messages/*.json porque la
 * página no tiene versión en inglés). El formulario envía a /api/lead con
 * form_id "consultoria-odoo" (ver src/lib/leads/forms.ts) y, si va bien,
 * redirige a la página de gracias común de la web (/es/gracias).
 */

const PUNTOS = [
  { value: 'nuevo', label: 'Quiero implantar Odoo por primera vez' },
  { value: 'existente', label: 'Ya uso Odoo y necesito mejorarlo' },
  { value: 'migracion', label: 'Vengo de Holded, Sage, SAP u otro ERP' },
] as const;

type Punto = (typeof PUNTOS)[number]['value'];

const CHECK_ICON = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5E5BC6"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

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
  [
    'Integraciones',
    'Tu tienda online, transportistas, CRM o plataformas EDI de tus clientes.',
  ],
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
  [
    'Rescate de implantaciones atascadas',
    'Retomamos el proyecto donde se quedó, sin empezar de nuevo.',
  ],
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
  [
    'Contabilidad y facturación',
    'Multiempresa, multidivisa, conciliación bancaria y localización española.',
  ],
  [
    'Inventario y almacén',
    'Multialmacén, códigos de barras, lotes y reglas de reabastecimiento.',
  ],
  [
    'Fabricación (MRP)',
    'Listas de materiales, órdenes de trabajo y control de calidad.',
  ],
  [
    'Ventas y CRM',
    'Pipeline, presupuestos y pedidos conectados con el resto del ERP.',
  ],
  ['Compras', 'Proveedores, acuerdos de precio y aprobaciones por importe.'],
  [
    'Ecommerce y TPV',
    'Tienda propia o Shopify, WooCommerce y PrestaShop con stock sincronizado.',
  ],
  [
    'Proyectos y partes de horas',
    'Seguimiento de horas, rentabilidad por proyecto y facturación por hitos.',
  ],
  [
    'Módulos a medida',
    'Cuando el estándar no llega, lo desarrollamos sin romper las actualizaciones.',
  ],
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
  [
    'Diagnóstico o auditoría',
    'Analizamos procesos, herramientas y, si ya tienes Odoo, su estado real. Sin coste.',
  ],
  [
    'Diseño funcional y presupuesto',
    'Documentamos cómo funcionará cada proceso en Odoo y lo dividimos en fases con alcance claro.',
  ],
  [
    'Configuración en pruebas',
    'Montamos Odoo, migramos datos y desarrollamos en un entorno separado de tu operativa.',
  ],
  [
    'Validación y formación',
    'Tu equipo prueba con pedidos, facturas y stock reales y aprende sobre su propio Odoo.',
  ],
  [
    'Arranque y soporte',
    'Pasamos a producción y seguimos contigo para ajustar lo que haga falta.',
  ],
];

const FILTROS = [
  'Todos',
  'Retail',
  'Logística',
  'Servicios',
  'RR.HH',
  'Real State',
  'Educación',
  'Migración ERP',
] as const;

const HERRAMIENTAS: { name: string; cat: (typeof FILTROS)[number] }[] = [
  { name: 'Shopify', cat: 'Retail' },
  { name: 'WooCommerce', cat: 'Retail' },
  { name: 'PrestaShop', cat: 'Retail' },
  { name: 'Square', cat: 'Retail' },
  { name: 'Sendcloud', cat: 'Logística' },
  { name: 'ShipStation', cat: 'Logística' },
  { name: 'EasyPost', cat: 'Logística' },
  { name: 'Amazon Seller', cat: 'Retail' },
  { name: 'HubSpot', cat: 'Servicios' },
  { name: 'Pipedrive', cat: 'Servicios' },
  { name: 'Sesame', cat: 'RR.HH' },
  { name: 'Personio', cat: 'RR.HH' },
  { name: 'Factorial', cat: 'RR.HH' },
  { name: 'PayFit', cat: 'RR.HH' },
  { name: 'Fotocasa', cat: 'Real State' },
  { name: 'Idealista', cat: 'Real State' },
  { name: 'Witei', cat: 'Real State' },
  { name: 'Moodle', cat: 'Educación' },
  { name: 'Teachable', cat: 'Educación' },
  { name: 'Holded', cat: 'Migración ERP' },
  { name: 'SAP Business One', cat: 'Migración ERP' },
  { name: 'Sage', cat: 'Migración ERP' },
  { name: 'Microsoft Dynamics 365', cat: 'Migración ERP' },
];

const FAQS = [
  [
    '¿Cuánto cuesta implantar Odoo?',
    'Depende de los módulos, el número de usuarios, la migración de datos y las integraciones. Tras el diagnóstico te damos un presupuesto por fases, para que sepas qué incluye cada una antes de empezar.',
  ],
  [
    '¿Cuánto tarda una implantación?',
    'Lo definimos en el diagnóstico según el alcance. Trabajar por fases permite tener en marcha lo más urgente, como facturación o almacén, sin esperar al proyecto completo.',
  ],
  [
    '¿Os podéis hacer cargo de un Odoo que implantó otro partner?',
    'Sí. Empezamos con una auditoría de la configuración y de los desarrollos a medida, y a partir de ahí asumimos el soporte y las mejoras.',
  ],
  [
    '¿Se pierden datos al actualizar de versión o migrar desde otro ERP?',
    'No. Hacemos la migración primero en un entorno de pruebas, la validas con tu equipo y solo entonces se pasa a producción.',
  ],
  [
    '¿Odoo Community o Enterprise?',
    'Depende de los módulos y de la localización fiscal que necesites. Te lo recomendamos en el diagnóstico con el coste de licencias de cada opción.',
  ],
  [
    '¿Odoo cumple con la normativa fiscal española?',
    'Configuramos la localización española: plan contable, impuestos, SII y facturación electrónica, incluida la adaptación a Verifactu.',
  ],
];

const ConsultoriaOdoo = () => {
  const locale = useLocale();
  const router = useRouter();

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
  const [submitError, setSubmitError] = useState<
    null | 'error' | 'rateLimited'
  >(null);
  // Antispam: honeypot + tiempo mínimo de rellenado (lo comprueba /api/lead).
  const [honeypot, setHoneypot] = useState('');
  const [renderedAt] = useState(() => Date.now());
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todos');

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
          punto:
            PUNTOS.find((p) => p.value === values.punto)?.label ?? values.punto,
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
      {/* Hero + formulario */}
      <section className="codoo-wrap codoo-hero">
        <div className="codoo-hero-grid">
          <div className="codoo-hero-copy">
            <span className="codoo-pill">Partner oficial de Odoo</span>
            <h1 className="codoo-h1">
              Consultoría e implantación de Odoo. Desde cero o sobre el que ya
              tienes.
            </h1>
            <p className="codoo-hero-sub">
              Diseñamos Odoo alrededor de cómo trabaja tu empresa, migramos tus
              datos y lo conectamos con tus herramientas. Si ya usas Odoo y no
              rinde como esperabas, lo auditamos y lo ponemos a trabajar.
            </p>
          </div>

          <form
            id="contacto"
            className="codoo-form codoo-hero-form"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h2 className="codoo-form-title">
                Pide tu diagnóstico sin coste
              </h2>
              <p className="codoo-form-sub">
                Un consultor de Odoo te llama en un día laborable.
              </p>
            </div>

            <fieldset>
              <legend>¿En qué punto estás?</legend>
              {PUNTOS.map((p) => (
                <label key={p.value} className="codoo-radio">
                  <input
                    type="radio"
                    name="punto"
                    value={p.value}
                    checked={values.punto === p.value}
                    onChange={() => set('punto', p.value)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </fieldset>

            <div className="codoo-fields">
              <label className="codoo-field">
                Nombre
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={200}
                  value={values.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                />
              </label>
              <label className="codoo-field">
                Empresa
                <input
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  required
                  maxLength={200}
                  value={values.empresa}
                  onChange={(e) => set('empresa', e.target.value)}
                />
              </label>
              <label className="codoo-field">
                Email de empresa
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={320}
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </label>
              <label className="codoo-field">
                Teléfono
                <input
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={50}
                  value={values.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                />
              </label>
            </div>

            <label className="codoo-field">
              <span>
                Qué necesitas resolver{' '}
                <span className="codoo-optional">(opcional)</span>
              </span>
              <textarea
                name="message"
                rows={2}
                maxLength={5000}
                placeholder="Por ejemplo: facturamos en Holded y el stock va en Excel"
                value={values.mensaje}
                onChange={(e) => set('mensaje', e.target.value)}
              />
            </label>

            <label className="codoo-consent">
              <input
                type="checkbox"
                name="rgpd"
                required
                checked={values.rgpd}
                onChange={(e) => set('rgpd', e.target.checked)}
              />
              <span>
                He leído y acepto la{' '}
                <Link href="/policy" target="_blank">
                  política de privacidad
                </Link>
              </span>
            </label>

            {submitError && (
              <p className="codoo-form-error" role="alert">
                {submitError === 'rateLimited'
                  ? 'Has enviado varias solicitudes seguidas. Espera unos minutos y vuelve a intentarlo.'
                  : 'No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a info@gigsonsolutions.com.'}
              </p>
            )}

            <button
              type="submit"
              className="codoo-btn codoo-submit"
              disabled={submitting}
            >
              {submitting ? 'Enviando…' : 'Solicitar diagnóstico'}
            </button>
            <p className="codoo-form-note">
              Sin compromiso. Solo usamos tus datos para responder a tu
              solicitud.
            </p>
          </form>

          <div className="codoo-hero-extra">
            <ul className="codoo-checks">
              <li>
                {CHECK_ICON}
                <span>
                  <strong>+320 implantaciones de Odoo</strong> entregadas.
                </span>
              </li>
              <li>
                {CHECK_ICON}
                <span>
                  Partner oficial de Odoo y de Holded: conocemos los dos lados
                  de la migración.
                </span>
              </li>
              <li>
                {CHECK_ICON}
                <span>
                  Equipo técnico propio para módulos a medida e integraciones.
                </span>
              </li>
            </ul>
            <div className="codoo-hero-links">
              <a href="#nuevo" className="codoo-btn codoo-btn--ghost">
                Ver proyecto nuevo
              </a>
              <a href="#existente" className="codoo-btn codoo-btn--ghost">
                Ver si ya tengo Odoo
              </a>
            </div>
          </div>
        </div>
      </section>

      <a href="#contacto" className="codoo-btn codoo-sticky">
        Solicitar diagnóstico
      </a>

      {/* Credenciales */}
      <section aria-label="Credenciales" className="codoo-wrap codoo-creds-sec">
        <div className="codoo-creds">
          <div>
            <span className="codoo-cred-value">Partner oficial</span>
            <span className="codoo-cred-label">
              de Odoo y de Holded en España
            </span>
          </div>
          <div>
            <span className="codoo-cred-value">+20</span>
            <span className="codoo-cred-label">
              herramientas que ya conectamos con Odoo
            </span>
          </div>
          <div>
            <span className="codoo-cred-value">+320</span>
            <span className="codoo-cred-label">
              implantaciones de Odoo entregadas
            </span>
          </div>
          <div>
            <span className="codoo-cred-value">Equipo propio</span>
            <span className="codoo-cred-label">
              consultoría funcional y desarrollo
            </span>
          </div>
        </div>
      </section>

      {/* Dos puntos de partida */}
      <section id="punto-de-partida" className="codoo-wrap codoo-paths-sec">
        <div className="codoo-head" style={{ maxWidth: 760 }}>
          <h2 className="codoo-paths-title">
            Dos puntos de partida, el mismo objetivo: un Odoo que tu equipo use
            de verdad.
          </h2>
          <p className="codoo-lead" style={{ fontSize: 18 }}>
            No es lo mismo empezar en blanco que heredar una instalación. Por
            eso el trabajo arranca distinto en cada caso.
          </p>
        </div>
        <div className="codoo-paths">
          <article id="nuevo" className="codoo-path">
            <span className="codoo-pill">Proyecto nuevo</span>
            <h3>Implantamos Odoo desde cero</h3>
            <p className="codoo-lead">
              Para empresas que trabajan con varias herramientas sueltas, hojas
              de cálculo o un ERP que se ha quedado pequeño.
            </p>
            <ul>
              {NUEVO.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              className="codoo-btn"
              onClick={() => set('punto', 'nuevo')}
            >
              Quiero implantar Odoo
            </a>
          </article>

          <article id="existente" className="codoo-path codoo-path--dark">
            <span className="codoo-pill">Ya tengo Odoo</span>
            <h3>Revisamos, rescatamos y hacemos crecer tu Odoo</h3>
            <p>
              Para empresas con una implantación a medias, un partner que ya no
              responde o una versión que se ha quedado atrás.
            </p>
            <ul>
              {EXISTENTE.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              className="codoo-btn codoo-btn--light"
              onClick={() => set('punto', 'existente')}
            >
              Revisar mi Odoo
            </a>
          </article>
        </div>
      </section>

      {/* Señales */}
      <section aria-labelledby="t-senales" className="codoo-white">
        <div className="codoo-wrap codoo-signals">
          <div className="codoo-signals-head">
            <h2 id="t-senales" className="codoo-h2">
              Si te reconoces en alguna de estas frases, hablemos.
            </h2>
            <p className="codoo-lead">
              Son las situaciones que más vemos en la primera llamada.
            </p>
          </div>
          <div className="codoo-signals-grid">
            {SENALES.map((q) => (
              <p key={q} className="codoo-quote">
                {q}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section
        id="modulos"
        aria-labelledby="t-modulos"
        className="codoo-wrap codoo-section"
      >
        <div className="codoo-head">
          <h2 id="t-modulos" className="codoo-h2">
            Los módulos que más implantamos
          </h2>
          <p className="codoo-lead">
            Empezamos por los que más impacto tienen en tu operativa y añadimos
            el resto por fases.
          </p>
        </div>
        <div className="codoo-modules">
          {MODULOS.map(([title, text]) => (
            <div key={title} className="codoo-module">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Migración */}
      <section
        id="migracion"
        aria-labelledby="t-migracion"
        className="codoo-wrap codoo-migration-sec"
      >
        <div className="codoo-migration">
          <div className="codoo-migration-copy">
            <span className="codoo-pill">Migración</span>
            <h2 id="t-migracion" className="codoo-h2">
              ¿Vienes de Holded u otro ERP? Te llevamos a Odoo sin perder
              histórico.
            </h2>
            <p>
              Somos partner de Holded y de Odoo, así que sabemos qué datos se
              mueven tal cual, cuáles hay que transformar y qué conviene dejar
              atrás. Cargamos primero en un entorno de prueba y validas tú antes
              del cambio.
            </p>
          </div>
          <ul className="codoo-chips">
            {ORIGENES.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" aria-labelledby="t-proceso" className="codoo-white">
        <div className="codoo-wrap codoo-section" style={{ gap: 44 }}>
          <div className="codoo-head">
            <h2 id="t-proceso" className="codoo-h2">
              Cómo trabajamos un proyecto de Odoo
            </h2>
            <p className="codoo-lead">
              El mismo método para un proyecto nuevo y para uno heredado. En los
              heredados, el paso uno es una auditoría.
            </p>
          </div>
          <ol className="codoo-steps">
            {PASOS.map(([title, text], i) => (
              <li key={title}>
                <span className="codoo-step-n">{i + 1}</span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Integraciones */}
      <section
        id="integraciones"
        aria-labelledby="t-integraciones"
        className="codoo-wrap codoo-section"
        style={{ gap: 32 }}
      >
        <div className="codoo-int-head">
          <h2 id="t-integraciones" className="codoo-h2">
            Odoo se conecta con las herramientas que ya usas
          </h2>
          <p>Software compatible</p>
        </div>
        <div
          role="group"
          aria-label="Filtrar por sector"
          className="codoo-filters"
        >
          {FILTROS.map((f) => (
            <button
              key={f}
              type="button"
              className="codoo-filter"
              aria-pressed={filtro === f}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="codoo-tools">
          {HERRAMIENTAS.filter(
            (h) => filtro === 'Todos' || h.cat === filtro
          ).map((h) => (
            <li key={h.name}>
              <a href="#contacto" title={`Conectar ${h.name}`}>
                {h.name}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          className="codoo-btn codoo-center"
          style={{ minHeight: 52, padding: '0 32px', fontSize: 15 }}
        >
          Empieza a implementar Odoo
        </a>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="t-faq" className="codoo-white">
        <div className="codoo-faq">
          <h2 id="t-faq" className="codoo-h2">
            Preguntas frecuentes
          </h2>
          <div>
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span className="codoo-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="codoo-wrap codoo-final-sec">
        <div className="codoo-final">
          <div className="codoo-final-copy">
            <h2>Empieza con un diagnóstico de tu Odoo, nuevo o existente.</h2>
            <p>
              Sin coste ni compromiso. Sales de la llamada sabiendo qué harías
              primero.
            </p>
          </div>
          <a href="#contacto" className="codoo-btn codoo-btn--light">
            Solicitar diagnóstico
          </a>
        </div>
      </section>

      {/* Aviso de independencia respecto a Odoo S.A. */}
      <section className="codoo-wrap codoo-disclaimer">
        <p>
          Gigson Solutions es una entidad independiente y no está afiliada ni
          forma parte de Odoo S.A. No representamos a Odoo ni actuamos en su
          nombre. Nuestra condición es exclusivamente la de partner oficial
          autorizado para la implementación y asesoramiento sobre sus productos
          y servicios.
        </p>
      </section>
    </div>
  );
};

export default ConsultoriaOdoo;
