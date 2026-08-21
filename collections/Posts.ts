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

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
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
        description: 'Idioma de este post. Cada post existe en un único idioma (sin gemelo automático).',
      },
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
