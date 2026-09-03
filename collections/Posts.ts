import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'locale', 'publishedAt', 'author'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.content) {
          try {
            data.contentHtml = convertLexicalToHTML({ data: data.content });
          } catch {
            // keep existing contentHtml if conversion fails
          }
        }
        return data;
      },
    ],
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
      type: 'group',
      admin: {
        description: 'Featured image',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Full image URL (Cloudinary, imgix, etc.)',
          },
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'contentHtml',
      type: 'textarea',
      admin: {
        readOnly: true,
        hidden: true,
        description: 'Auto-generated HTML from content. Do not edit manually.',
      },
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
