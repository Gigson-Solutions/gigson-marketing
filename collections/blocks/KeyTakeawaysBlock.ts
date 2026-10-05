import type { Block } from 'payload';

/**
 * "Lo esencial" summary block — a self-contained 3-5 bullet takeaway placed
 * near the top of a post. It's the second most-extracted format (after FAQ)
 * for generative engines answering a query without reading the full 1000+
 * word article. Rendered as a highlighted `<ul>` by
 * `src/components/Blog/richTextConverters.tsx`, and fed into
 * `BlogPosting.abstract` in the post's JSON-LD.
 */
export const KeyTakeawaysBlock: Block = {
  slug: 'keyTakeaways',
  labels: { singular: 'Lo esencial', plural: 'Bloques "Lo esencial"' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Lo esencial',
      admin: { description: 'Título de la sección, ej. "Lo esencial"' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      labels: { singular: 'Punto', plural: 'Puntos' },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
