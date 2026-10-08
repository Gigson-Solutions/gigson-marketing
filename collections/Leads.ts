import type { CollectionConfig } from 'payload';

/**
 * Leads from the site's own forms (home, contact, integrations, ISO 27001).
 *
 * These forms used to POST straight to formsubmit.co from the browser, which
 * meant the recipient address sat in the public HTML and an email was the only
 * record a lead ever left — if FormSubmit was down, the lead was gone. They now
 * go through `app/api/lead/route.ts`, which writes here first and treats the
 * notification email as best-effort.
 *
 * Kept separate from `chatbot-leads` on purpose: that collection requires a
 * `message` and carries a conversation transcript, and mixing a conversational
 * flow with campaign-attributed form capture would muddle both the admin views
 * and the Ads reporting.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'company', 'formId', 'status', 'createdAt'],
    description:
      'Leads de los formularios del sitio (home, contacto, integraciones, ISO 27001).',
  },
  access: {
    // Created server-side by the API route, which does its own validation.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'formId',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Formulario de origen (ver src/lib/leads/forms.ts)' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Nuevo', value: 'new' },
        { label: 'Spam', value: 'spam' },
      ],
      defaultValue: 'new',
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'spamReasons',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Señales que lo marcaron como spam (botid, too_fast…)',
      },
    },

    { name: 'name', type: 'text' },
    {
      // Deliberately `text` and not `email`: the ISO 27001 form accepts a phone
      // number instead, so this can legitimately be empty.
      name: 'email',
      type: 'text',
      index: true,
    },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      // Form-specific answers (service, budget, tool, sector…). Stored as JSON
      // so a new landing page doesn't need a schema migration.
      name: 'extra',
      type: 'json',
      admin: { description: 'Campos específicos del formulario' },
    },

    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
      ],
      defaultValue: 'es',
      admin: { position: 'sidebar' },
    },
    { name: 'pagePath', type: 'text', admin: { position: 'sidebar' } },
    { name: 'rgpd', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'notifiedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Cuándo se envió el email de aviso. Vacío = solo quedó en la BD.',
      },
    },

    // Attribution, flattened into columns so campaign performance is queryable
    // from the admin without digging into JSON. Mirrors ATTRIBUTION_FIELDS in
    // src/lib/attribution.ts. The visitor's IP is deliberately NOT stored: it's
    // personal data under GDPR and the privacy policy doesn't cover it.
    { name: 'gclid', type: 'text', index: true },
    { name: 'gbraid', type: 'text' },
    { name: 'wbraid', type: 'text' },
    { name: 'utmSource', type: 'text', index: true },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text', index: true },
    { name: 'utmTerm', type: 'text' },
    { name: 'utmContent', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'landingPage', type: 'text' },
  ],
};
