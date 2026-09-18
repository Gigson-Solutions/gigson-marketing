import type { CollectionConfig } from 'payload';

/**
 * Author profiles for blog posts. One document per human (never one per
 * locale — `bio`/`jobTitle` are groups with `.es`/`.en` inside), the same
 * "one node, referenced everywhere" pattern `lib/schema.ts#ORGANIZATION_ID`
 * already established for the Organization schema. Before this collection
 * existed, `Posts.author` was a plain text field that rendered a bare
 * string and, worse, fed a `Person` schema with no identity behind it —
 * sometimes literally "Gigson Solutions", a company declared as a person.
 *
 * Linked from `Posts` via the new `authorProfile` relationship field, not by
 * converting `author` into a foreign key — that would be a destructive
 * column type change. `author` stays, marked read-only, for posts that
 * predate this collection.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador de URL — usado en /blog/authors/[author] y /blog/autores/[author].',
      },
    },
    {
      name: 'jobTitle',
      type: 'group',
      fields: [
        { name: 'es', type: 'text' },
        { name: 'en', type: 'text' },
      ],
    },
    {
      name: 'bio',
      type: 'group',
      fields: [
        { name: 'es', type: 'textarea' },
        { name: 'en', type: 'textarea' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: {
        description:
          'URL completa del perfil de LinkedIn. Si se deja vacío, el schema Person no declara sameAs — nunca un placeholder.',
      },
    },
    {
      name: 'knowsAbout',
      type: 'array',
      labels: { singular: 'Tema', plural: 'Temas' },
      fields: [{ name: 'text', type: 'text', required: true }],
      admin: {
        description: 'Temas de expertise (ej. "Agentes IA", "ISO 27001") — alimenta Person.knowsAbout.',
      },
    },
  ],
};
