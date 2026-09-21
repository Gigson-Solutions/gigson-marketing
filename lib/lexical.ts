// Pure utility, deliberately separate from `lib/posts.ts` — that module
// imports `next/headers` (server-only), so anything importing a *value*
// from it (not just types) gets pulled into the server module graph and
// breaks when imported from a 'use client' component. This file is reachable
// from `src/components/Blog/richTextConverters.tsx`, which is a client
// component — same constraint documented in `lib/readingTime.ts`.
// Keep this file free of server-only imports.

type LexicalNode = {
  type?: string;
  children?: LexicalNode[];
  fields?: { blockType?: string } & Record<string, unknown>;
};

/**
 * Recursively collects the `fields` of every Lexical block node whose
 * `fields.blockType` matches `blockType`, anywhere in the serialized tree —
 * not just root-level children. Today every custom block (`cta`, `highlight`,
 * `faq`, ...) is a direct child of `root`, but a future container block
 * (e.g. a two-column layout) would otherwise make its nested blocks silently
 * invisible to schema builders that only looked at `root.children`.
 */
export function collectBlockFields<T extends { blockType: string }>(
  content: unknown,
  blockType: string,
): T[] {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return [];

  const results: T[] = [];
  const walk = (node: LexicalNode | undefined) => {
    if (!node) return;
    if (node.type === 'block' && node.fields?.blockType === blockType) {
      results.push(node.fields as T);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return results;
}

export type FaqBlockFields = {
  blockType: 'faq';
  heading?: string;
  items: { question: string; answer: string }[];
};
