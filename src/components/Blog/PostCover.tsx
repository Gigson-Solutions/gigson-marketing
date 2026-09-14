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
  const uploaded = post.coverImage?.sizes?.[variant]?.url ?? post.coverImage?.url;

  if (uploaded) {
    return <img src={uploaded} alt={post.coverImage?.alt ?? ''} className="w-full h-full object-cover" />;
  }

  // `Collage` is width:100% with a viewBox, so its intrinsic ratio fills the
  // caller's aspect box exactly. Adding h-full here would letterbox it.
  return <Collage layers={resolveCover(post).build(EDITORIAL)} background={EDITORIAL.bg} aspect={COVER_ASPECT} />;
}
