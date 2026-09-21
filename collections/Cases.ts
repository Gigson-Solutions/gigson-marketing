import type { CollectionConfig } from 'payload';

/** Payload relationship fields store either a bare id or a populated doc
 * (depending on `depth`) — normalize to just the id for comparisons.
 * Same helper, same reason, as `collections/Posts.ts`. */
const relationshipId = (value: unknown): string | number | undefined => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: string | number }).id;
  }
  return value as string | number | undefined;
};

/**
 * Case studies. They used to live as a flat `casesDropdown` array in
 * `messages/{en,es}.json`, addressed only by array index — which meant no case
 * had a URL of its own. All five competed for `/casos`, behind a filter widget,
 * so the most citable asset the company owns (a real problem, in a named
 * sector, with a measurable result) could not be linked to, cited, or ranked
 * for the query it answers.
 *
 * Modelled on `Posts`: one document per language rather than Payload field
 * localization, joined by `localizedVersion`, because that is what the blog
 * already does and what `postUrl`/`caseUrl` and the language selector expect.
 */
export const Cases: CollectionConfig = {
  slug: 'cases',
  access: {
    read: () => true,
  },
  hooks: {
    // Two-way `localizedVersion` sync, identical to Posts' — see the comment
    // there for why `req` has to be threaded through these nested calls.
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const newTargetId = relationshipId(doc.localizedVersion);
        const oldTargetId = relationshipId(previousDoc?.localizedVersion);
        if (!newTargetId || newTargetId === oldTargetId) return;

        const target = await req.payload.findByID({
          collection: 'cases',
          id: newTargetId,
          depth: 0,
          req,
        });
        if (relationshipId(target?.localizedVersion) === doc.id) return;

        await req.payload.update({
          collection: 'cases',
          id: newTargetId,
          data: { localizedVersion: doc.id },
          depth: 0,
          req,
        });
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'locale', 'publishedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador de URL — usado en /cases/[slug] y /casos/[slug].',
      },
    },
    {
      name: 'challenge',
      type: 'textarea',
      required: true,
      admin: { description: 'El problema del cliente, en sus términos. Es lo primero que se cita.' },
    },
    {
      name: 'solution',
      type: 'textarea',
      admin: { description: 'Qué se construyó y cómo resuelve el reto.' },
    },
    {
      name: 'features',
      type: 'array',
      labels: { singular: 'Funcionalidad', plural: 'Funcionalidades' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'results',
      type: 'array',
      labels: { singular: 'Resultado', plural: 'Resultados' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: {
        description:
          'Resultados medibles ("cumplimiento de fichajes del 100%"). Es la parte que un motor generativo cita; una cifra concreta vale más que tres frases.',
      },
    },
    {
      name: 'tools',
      type: 'array',
      labels: { singular: 'Herramienta', plural: 'Herramientas' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: {
        description:
          'Sistemas concretos, con su nombre de producto (Odoo, Holded, HubSpot, Amazon SP-API). Son las entidades por las que se pregunta.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      labels: { singular: 'Sector', plural: 'Sectores' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: { description: 'Sectores por los que se filtra en el índice /casos.' },
    },
    {
      name: 'need',
      type: 'array',
      labels: { singular: 'Necesidad', plural: 'Necesidades' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: { description: 'Necesidades por las que se filtra en el índice /casos.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
      ],
      defaultValue: 'es',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Idioma de este caso.',
      },
    },
    {
      name: 'localizedVersion',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description:
          'El mismo caso en el otro idioma (si existe) — alimenta el hreflang y el selector de idioma. Se sincroniza en ambos sentidos al guardar.',
      },
      // No `filterOptions`, for the same reason documented in `Posts`: it
      // rejected the reverse-link write from the afterChange hook.
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        condition: (data) => data.status === 'published',
        description: 'Set when publishing the case',
      },
    },
  ],
};
