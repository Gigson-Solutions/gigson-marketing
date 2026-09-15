import type { Block } from 'payload';

/** Pull-quote / highlight card block — maps to the DSM "pull-quote card"
 * (30px radius, purple-fade gradient fill, cream type). Used to call out a
 * client metric or a strong statement inside a blog post. */
export const HighlightBlock: Block = {
  slug: 'highlight',
  labels: { singular: 'Cita destacada', plural: 'Citas destacadas' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: { description: 'La cita o el dato destacado, ej. una métrica de un caso real.' },
    },
    {
      name: 'attribution',
      type: 'text',
      admin: { description: 'Opcional — ej. "Caso real — gigson solutions"' },
    },
  ],
};
