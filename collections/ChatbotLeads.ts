import type { CollectionConfig } from 'payload';

export const ChatbotLeads: CollectionConfig = {
  slug: 'chatbot-leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'company', 'locale', 'pagePath', 'createdAt'],
    description: 'Leads capturados por el chatbot Alfonso. Incluye el transcript completo de la conversación.',
  },
  access: {
    // Only authenticated admins can read / update / delete leads.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    // Creation is performed by the API route (server-side), no auth required there.
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Nombre del contacto' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      admin: { description: 'Empresa (opcional)' },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: { description: 'Resumen de la necesidad enviado en el formulario' },
    },
    {
      name: 'conversation',
      type: 'textarea',
      admin: {
        description: 'Transcript completo de la conversación con Alfonso antes de enviar el formulario',
      },
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
    {
      name: 'pagePath',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Página desde donde abrió el chatbot',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'gigson-chatbot',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'ID de sesión del chatbot',
      },
    },
    {
      name: 'rgpd',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'El contacto aceptó la política de privacidad (LOPD/RGPD)',
      },
    },
  ],
};
