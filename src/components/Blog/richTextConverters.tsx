import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import type { DefaultNodeTypes, SerializedBlockNode, SerializedHeadingNode } from '@payloadcms/richtext-lexical';

import { Link } from '../../../i18n/navigation';
import type { AppPathnames } from '../../../i18n/routing';
import FaqAccordion from './FaqAccordion';

// `/blog/[slug]` is a dynamic route pattern requiring params — the CTA
// block only ever links to static service pages, so it's excluded here
// (same pattern as `NavPathname` in Navbar/Footer).
type CtaHref = Exclude<AppPathnames, '/blog/[slug]' | '/blog/category/[category]'>;

type CtaBlockFields = {
  blockType: 'cta';
  heading: string;
  label: string;
  href: string;
};

type HighlightBlockFields = {
  blockType: 'highlight';
  text: string;
  attribution?: string;
};

type FaqBlockFields = {
  blockType: 'faq';
  heading?: string;
  items: { question: string; answer: string }[];
};

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CtaBlockFields | HighlightBlockFields | FaqBlockFields>;

/** Plain text of a heading's inline children (text/link/etc.), for slugifying —
 * headings only ever have inline content, never nested blocks. */
function headingText(node: { children?: unknown[] }): string {
  return (node.children ?? [])
    .map((raw) => {
      const child = raw as { text?: string; children?: unknown[] };
      if (typeof child.text === 'string') return child.text;
      if (Array.isArray(child.children)) return headingText({ children: child.children });
      return '';
    })
    .join('')
    .trim();
}

const COMBINING_DIACRITICS = new RegExp('[̀-ͯ]', 'g');

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Converts Payload's Lexical `content` field to JSX for `BlogPost.tsx`,
 * replacing the previous `contentHtml` (convertLexicalToHTML) pipeline.
 * Handles the three custom blocks (`cta`, `highlight`, `faq`) plus inline
 * uploaded images — none of which the generic HTML converter can render
 * on its own.
 */
export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  // Scoped to one `jsxConverters(...)` call, i.e. one <RichText> render (one
  // post) — never module-level, which would leak counts across concurrent
  // requests for different posts on the same server.
  const usedSlugs = new Map<string, number>();
  const uniqueSlug = (base: string): string => {
    const count = usedSlugs.get(base) ?? 0;
    usedSlugs.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  return {
  ...defaultConverters,
  heading: ({ node, nodesToJSX }: { node: SerializedHeadingNode; nodesToJSX: (args: { nodes: SerializedHeadingNode['children'] }) => React.ReactNode[] }) => {
    const children = nodesToJSX({ nodes: node.children });
    const NodeTag = node.tag as keyof React.JSX.IntrinsicElements;
    const text = headingText(node);
    const id = text ? uniqueSlug(slugify(text)) : undefined;
    return <NodeTag id={id}>{children}</NodeTag>;
  },
  blocks: {
    cta: ({ node }) => (
      <div className="cta-block border border-purple-accents rounded-[30px] p-8 lg:p-10 my-8 not-prose">
        <p className="text-h4 text-dark-primary mb-4">{node.fields.heading}</p>
        <Link
          href={node.fields.href as CtaHref}
          className="inline-block rounded-full border border-purple-accents text-purple-accents text-button uppercase tracking-wide px-8 py-3 hover:bg-purple-accents hover:text-cream transition-colors"
        >
          {node.fields.label}
        </Link>
      </div>
    ),
    highlight: ({ node }) => (
      <div
        className="rounded-[30px] p-10 lg:p-12 my-8 not-prose"
        style={{ background: 'linear-gradient(180deg, rgba(120,116,244,0.7) 0%, rgba(120,116,244,0) 100%)' }}
      >
        <p className="text-h4 text-cream mb-2">{node.fields.text}</p>
        {node.fields.attribution && (
          <p className="text-smallTag text-cream uppercase tracking-widest opacity-80">
            {node.fields.attribution}
          </p>
        )}
      </div>
    ),
    faq: ({ node }) => (
      <FaqAccordion heading={node.fields.heading} items={node.fields.items ?? []} />
    ),
  },
  };
};
