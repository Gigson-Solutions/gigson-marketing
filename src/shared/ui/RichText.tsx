'use client';

import type { ElementType, HTMLAttributes } from 'react';

type RichTextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  content: string;
};

// Renders translation strings that contain <span> and <br> HTML tags.
// <span> gets the purple accent color; content is from our own translations (not user input).
export function RichText({ as: Tag = 'span', content, ...rest }: RichTextProps) {
  const html = content
    .replace(/<span>/g, '<span class="text-purple-accents">')
    .replace(/<br\s*\/?>/gi, '<br/>');
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
