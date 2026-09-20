import { resolveCover } from '../../../lib/blogCovers';
import type { Post } from '../../../lib/posts';
// Direct imports, not the `shapes` barrel — see the note in lib/blogCovers.ts.
import { Collage } from '../../design-system/shapes/Collage';
import { COVER_ASPECT, EDITORIAL } from '../../design-system/shapes/covers';

type Props = {
  post: Pick<Post, 'slug' | 'title' | 'category' | 'coverImage'>;
  /** Which Payload size to prefer when the post has a real uploaded cover. */
  variant?: 'hero' | 'card';
};

// Matches `collections/Media.ts#imageSizes` — kept here rather than imported
// (that file isn't safe to import from a client component; see the
// `lib/blogCovers.ts` note on why `lib/posts.ts` isn't either).
const SIZE_WIDTHS = { thumbnail: 400, card: 900, hero: 1600 } as const;

/**
 * The picture of a post, wherever it appears.
 *
 * An uploaded `coverImage` always wins. With none, this draws the generated
 * composition the post maps to, so an article is never pictureless — that used
 * to be a flat purple gradient on the cards and nothing at all on the article.
 *
 * The caller keeps the frame (aspect box, radius, overflow) because each
 * surface has its own corner radius: 22px featured, 24px related, 30px hero.
 */
export default function PostCover({ post, variant = 'card' }: Props) {
  const sizes = post.coverImage?.sizes;
  const uploaded = sizes?.[variant]?.url ?? post.coverImage?.url;

  if (uploaded) {
    const srcSet = (Object.keys(SIZE_WIDTHS) as (keyof typeof SIZE_WIDTHS)[])
      .map((size) => {
        const url = sizes?.[size]?.url;
        return url ? `${url} ${SIZE_WIDTHS[size]}w` : null;
      })
      .filter((entry): entry is string => Boolean(entry))
      .join(', ');

    const dims = sizes?.[variant] ?? post.coverImage;
    const isHero = variant === 'hero';

    return (
      <img
        src={uploaded}
        srcSet={srcSet || undefined}
        // The hero fills its `max-w-[52rem]` article column; cards sit in a
        // multi-column grid, so they're never wider than ~1/3 of the viewport
        // on desktop. Approximate, not pixel-exact — the point is serving
        // 400px/900px crops to small viewports instead of always the 1600px
        // hero.
        sizes={isHero ? '(min-width: 52rem) 52rem, 100vw' : '(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw'}
        width={dims?.width}
        height={dims?.height}
        alt={post.coverImage?.alt ?? ''}
        className="w-full h-full object-cover"
        // The hero is the LCP candidate on a post page; cards are below the
        // fold or in a grid the reader scrolls to.
        {...(isHero ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
      />
    );
  }

  // `Collage` is width:100% with a viewBox, so its intrinsic ratio fills the
  // caller's aspect box exactly. Adding h-full here would letterbox it.
  return <Collage layers={resolveCover(post).build(EDITORIAL)} background={EDITORIAL.bg} aspect={COVER_ASPECT} />;
}
