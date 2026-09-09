import type { Block } from 'payload';

/**
 * "Preguntas frecuentes" block for blog post content — competitor research
 * (2026-08 SEO/content review) showed this pattern on rival AI-agent blogs
 * (Companies Automation) reinforcing trust and capturing FAQ-schema snippets.
 * Rendered as an interactive accordion by
 * `src/components/Blog/richTextConverters.tsx`.
 */
export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Preguntas frecuentes',
      admin: { description: 'Título de la sección, ej. "Preguntas frecuentes"' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Pregunta', plural: 'Preguntas' },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
};
