import type { CollectionConfig } from 'payload';
import {
  lexicalEditor,
  UploadFeature,
  HorizontalRuleFeature,
  FixedToolbarFeature,
  BlocksFeature,
} from '@payloadcms/richtext-lexical';

import { CtaBlock } from './blocks/CtaBlock';
import { HighlightBlock } from './blocks/HighlightBlock';
import { FaqBlock } from './blocks/FaqBlock';

/** Payload relationship fields store either a bare id or a populated doc
 * (depending on `depth`) — normalize to just the id for comparisons. */
const relationshipId = (value: unknown): string | number | undefined => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: string | number }).id;
  }
  return value as string | number | undefined;
};

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  hooks: {
    // Keeps `localizedVersion` a real two-way link without editors having to
    // remember to set it on both posts: saving A → B automatically points
    // B back at A, unless B already points somewhere else (never overwrite
    // an existing link silently).
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const newTargetId = relationshipId(doc.localizedVersion);
        const oldTargetId = relationshipId(previousDoc?.localizedVersion);
        if (!newTargetId || newTargetId === oldTargetId) return;

        // `req` must be threaded through explicitly — without it, these
        // nested calls open their own transaction instead of joining the
        // one this hook is already running in, and won't see the parent
        // write yet (surfaced locally as a bogus FK violation: "id X is
        // not present in table posts" for an X that very much exists).
        const target = await req.payload.findByID({
          collection: 'posts',
          id: newTargetId,
          depth: 0,
          req,
        });
        if (relationshipId(target?.localizedVersion) === doc.id) return;

        await req.payload.update({
          collection: 'posts',
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
    defaultColumns: ['title', 'status', 'locale', 'publishedAt', 'author'],
    preview: (doc) => {
      const slug = doc?.slug as string | undefined;
      const locale = (doc?.locale as string | undefined) ?? 'es';
      if (!slug) return null;

      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';
      const secret = process.env.PAYLOAD_PREVIEW_SECRET ?? '';
      const path = locale === 'es' ? `/es/blog/${slug}` : `/blog/${slug}`;

      return `${serverURL}/api/preview?secret=${secret}&path=${encodeURIComponent(path)}`;
    },
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
        description: 'URL identifier — use lowercase letters, numbers and hyphens (e.g. "automatizacion-erp-2026")',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Agentes IA', value: 'agentes-ia' },
        { label: 'Integraciones ERP (Holded/Odoo)', value: 'integraciones-erp' },
        { label: 'Ciberseguridad', value: 'ciberseguridad' },
        { label: 'Ingeniería de software', value: 'ingenieria-software' },
        { label: 'Consultoría tecnológica / CTO as a Service', value: 'consultoria-tecnologica' },
        { label: 'Casos de éxito', value: 'casos-exito' },
        { label: 'Sectores (logística, retail, construcción, servicios profesionales)', value: 'sectores' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pilar temático del post — se usa para filtrar en /blog y agrupar posts relacionados.',
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
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Idioma de este post.',
      },
    },
    {
      name: 'localizedVersion',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description:
          'El mismo artículo en el otro idioma (si existe) — alimenta el hreflang y el selector de idioma en la página del post. Se sincroniza automáticamente en ambos sentidos al guardar; no hace falta editarlo también en el otro post.',
      },
      // No `filterOptions` here on purpose: it broke the reverse-link write
      // in the afterChange hook below (Payload re-validates filterOptions
      // against the just-updated document and — likely a transaction/
      // read-visibility timing issue with `id: { not_equals }` — rejected
      // a value that trivially satisfied it). Self-selection just isn't
      // filtered out of the admin dropdown; low cost, and the hook's own
      // `newTargetId === doc.id` check still prevents a doc from ever
      // actually pointing at itself via automatic sync.
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        condition: (data) => data.status === 'published',
        description: 'Set when publishing the post',
      },
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown in the blog listing page and as meta description',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image (elige o sube desde la librería de Media).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [{ name: 'caption', type: 'text' }],
              },
            },
          }),
          HorizontalRuleFeature(),
          FixedToolbarFeature(),
          BlocksFeature({ blocks: [CtaBlock, HighlightBlock, FaqBlock] }),
        ],
      }),
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Override page title for Google (defaults to title if empty)',
      },
    },
    {
      name: 'seoDescription',
      type: 'text',
      admin: {
        description: 'Override meta description (defaults to excerpt if empty)',
      },
    },
  ],
};
