// Pure utility, deliberately separate from `lib/posts.ts` — that module
// imports `next/headers` (server-only), so anything importing a *value*
// from it (not just types) gets pulled into the server module graph and
// breaks when imported from a 'use client' component (BlogList/BlogPost).
// Keep this file free of server-only imports.

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] };

function extractText(node: LexicalNode | undefined): string {
  if (!node) return '';
  const own = typeof node.text === 'string' ? node.text : '';
  const children = Array.isArray(node.children) ? node.children.map(extractText).join(' ') : '';
  return `${own} ${children}`;
}

/** Estimates reading time from the real serialized Lexical content
 * (~200 words/min) instead of a hardcoded number — returns `null` when
 * there's no content to measure yet (e.g. a draft with only a title). */
export function estimateReadingTime(content: unknown, wordsPerMinute = 200): number | null {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return null;
  const text = extractText(root).trim();
  if (!text) return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
