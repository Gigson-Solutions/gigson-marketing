/**
 * The per-form rules for `/api/lead`.
 *
 * This is the only place that knows what a given form requires and where its
 * notification goes — crucially, server-side. The subject and the recipients
 * used to be hidden inputs in the page, which meant anyone could read the
 * destination address out of the HTML (and post to it directly). Nothing here
 * ever comes from the client; the client only sends a `form_id`.
 *
 * Adding a landing page = adding an entry here.
 */

type Requirement = 'name' | 'email' | 'phone' | 'company' | 'message';

export type FormDefinition = {
  /** Subject of the notification email. */
  subject: string;
  /** Extra recipients on top of LEAD_EMAIL_CC. */
  cc?: string[];
  /** Canonical fields that must be present. */
  required: Requirement[];
  /** At least one of these must be present (ISO 27001 takes email OR phone). */
  requireOneOf?: Requirement[];
  /** Human labels for `fields` keys, used to format the email. */
  labels?: Record<string, string>;
};

const INTEGRATION_LABELS: Record<string, string> = {
  tool: 'Herramienta a conectar',
  data_types: 'Datos a sincronizar',
  problem: 'Problema a resolver',
};

const INTEGRATION_REQUIRED: Requirement[] = ['name', 'email', 'phone', 'company'];

/** Definition shared by every page that embeds the generic contact form. */
function genericForm(page: string): FormDefinition {
  return {
    subject: `Lead · ${page} · gigsonsolutions.com`,
    required: ['name', 'email'],
    labels: { service: 'Servicio', budget: 'Presupuesto' },
  };
}

export const LEAD_FORMS = {
  home: {
    subject: 'Lead · Home · gigsonsolutions.com',
    required: ['name', 'email'],
    labels: { service: 'Servicio', budget: 'Presupuesto' },
  },
  contact: {
    subject: 'Lead · Contacto · gigsonsolutions.com',
    required: ['name', 'email'],
    labels: { service: 'Servicio', budget: 'Presupuesto' },
  },

  'integrations-holded': {
    subject: 'Nueva consulta de integraciones Holded',
    required: INTEGRATION_REQUIRED,
    labels: INTEGRATION_LABELS,
  },
  'integrations-odoo': {
    subject: 'Nueva consulta de integraciones Odoo',
    required: INTEGRATION_REQUIRED,
    labels: INTEGRATION_LABELS,
  },
  'custom-erp': {
    subject: 'Nueva consulta de ERP a medida',
    required: INTEGRATION_REQUIRED,
    labels: INTEGRATION_LABELS,
  },

  // The generic contact form (src/components/Form.tsx) embedded at the bottom
  // of every service and industry page. Same fields as home/contact; the id
  // only changes the subject so the team can tell at a glance which page the
  // lead came from (page_path is also stored, but the subject is what you
  // see in the inbox).
  'service-cto': genericForm('CTO as a Service'),
  'service-technology-consulting': genericForm('Consultoría tecnológica'),
  'service-cybersecurity': genericForm('Ciberseguridad'),
  'service-iso-27001': genericForm('ISO 27001 (servicio)'),
  'service-ai-agents': genericForm('Agentes IA'),
  'service-software-engineering': genericForm('Ingeniería de software'),
  'industry-logistics': genericForm('Logística'),
  'industry-retail': genericForm('Retail y e-commerce'),
  'industry-construction': genericForm('Construcción'),
  'industry-professional-services': genericForm('Servicios profesionales'),
  'claude-partner': genericForm('Claude Partner'),

  'consultoria-odoo': {
    subject: 'Lead · Consultoría Odoo · gigsonsolutions.com',
    required: ['name', 'email', 'phone', 'company'],
    labels: { punto: 'Punto de partida' },
  },

  iso27001: {
    subject: 'Lead · ISO 27001 · gigsonsolutions.com',
    cc: ['hello@gigsonsolutions.com'],
    required: ['name', 'company'],
    // The wizard lets a visitor leave either a phone or an email, not both.
    requireOneOf: ['email', 'phone'],
    labels: { sector: 'Sector', cargo: 'Cargo', necesitas: 'Necesita' },
  },
  // `satisfies` and not a `Record<string, FormDefinition>` annotation: the
  // annotation would widen `keyof typeof LEAD_FORMS` to `string` and make
  // `LeadFormId` below a type that checks nothing, so a mistyped `formId` at a
  // call site would compile and only show up as a 400 the visitor reads as
  // "something went wrong".
} satisfies Record<string, FormDefinition>;

export type LeadFormId = keyof typeof LEAD_FORMS;

/**
 * The only way to turn a request's `form_id` into a definition.
 *
 * `Object.hasOwn` and not a plain lookup, because that string comes from the
 * body: `LEAD_FORMS['toString']` would otherwise hand back a function that
 * passes a truthy check and then blows up on `def.required`.
 */
export function getFormDefinition(formId: unknown): FormDefinition | undefined {
  if (typeof formId !== 'string' || !Object.hasOwn(LEAD_FORMS, formId))
    return undefined;
  return LEAD_FORMS[formId as LeadFormId];
}
