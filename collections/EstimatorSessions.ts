import type { CollectionConfig } from 'payload';

// One document per estimator session (/project-estimator), created once the
// user leaves step 4 (either "Generate features" or "Skip"). Steps 1-4 alone
// live only in client state — see lib/estimator/types.ts for the shapes
// mirrored here. `publicToken` (not the numeric Payload id) is the only
// identifier ever exposed to the client, to avoid enumeration of other
// people's project descriptions / emails.
export const EstimatorSessions: CollectionConfig = {
  slug: 'estimator-sessions',
  admin: {
    useAsTitle: 'publicToken',
    defaultColumns: ['publicToken', 'status', 'leadEmail', 'businessDomain', 'createdAt'],
    description: 'Sesiones del estimador de proyectos con IA (/project-estimator / /estimador-de-proyecto).',
  },
  access: {
    // Written only by our own server-side API routes (app/api/estimator/**).
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'publicToken',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Token opaco usado en la URL/API pública — nunca el id numérico interno.' },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'generating', 'features_ready', 'generation_failed', 'finalized', 'completed'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    { name: 'locale', type: 'select', options: [{ label: 'Español', value: 'es' }, { label: 'English', value: 'en' }], defaultValue: 'es' },
    { name: 'pagePath', type: 'text', admin: { position: 'sidebar' } },
    { name: 'source', type: 'text', defaultValue: 'project-estimator', admin: { position: 'sidebar' } },

    // ── Step 1-4 inputs (flat fields; simpler for a v1 than a nested group) ──
    { name: 'hourlyRate', type: 'number', required: true },
    { name: 'projectDescription', type: 'textarea', required: true },
    { name: 'businessDomain', type: 'text', required: true },
    { name: 'businessDomainOther', type: 'text' },
    { name: 'competitors', type: 'array', maxRows: 10, fields: [{ name: 'value', type: 'text' }] },
    { name: 'roles', type: 'text' }, // comma-separated (user,admin,other)
    { name: 'rolesOther', type: 'text' },
    { name: 'appSize', type: 'text' },
    { name: 'platforms', type: 'text' }, // comma-separated
    { name: 'uiLevel', type: 'text' },
    { name: 'qaLevel', type: 'text' },
    { name: 'timelineMode', type: 'text' },
    { name: 'timelineOverallMonths', type: 'number' },
    { name: 'timelinePhaseMvpMonths', type: 'number' },
    { name: 'timelinePhase2Months', type: 'number' },
    { name: 'timelinePhaseFutureMonths', type: 'number' },

    // ── Step 5: AI-generated / edited features ──
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'clientId', type: 'text' },
        { name: 'name', type: 'text', required: true },
        { name: 'userStory', type: 'text' },
        { name: 'acceptanceCriteria', type: 'array', fields: [{ name: 'criterion', type: 'text' }] },
        { name: 'thirdPartyServices', type: 'text' },
        { name: 'hoursFrontend', type: 'number', defaultValue: 0 },
        { name: 'hoursQa', type: 'number', defaultValue: 0 },
        { name: 'hoursBackend', type: 'number', defaultValue: 0 },
        { name: 'hoursUiux', type: 'number', defaultValue: 0 },
        { name: 'hoursBapm', type: 'number', defaultValue: 0 },
        { name: 'source', type: 'select', options: ['ai', 'manual'], defaultValue: 'manual' },
      ],
    },

    // ── Step 6: deterministic outputs ──
    { name: 'teamComposition', type: 'json' }, // { frontend, qa, backend, uiux, bapm } FTE
    { name: 'timeline', type: 'json' }, // { totalWeeks, bars: [{ role, startWeek, endWeek }] }
    { name: 'totalHours', type: 'number' },
    { name: 'totalBudget', type: 'number' },

    // ── Lead capture ──
    { name: 'leadEmail', type: 'email' },
    { name: 'leadName', type: 'text' },
    { name: 'leadCompany', type: 'text' },
    { name: 'rgpd', type: 'checkbox', defaultValue: false },
    { name: 'leadCapturedAt', type: 'date' },
    { name: 'teamNotifiedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
};
