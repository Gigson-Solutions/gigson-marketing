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

export const LEAD_FORMS: Record<string, FormDefinition> = {
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
};

export type LeadFormId = keyof typeof LEAD_FORMS;
