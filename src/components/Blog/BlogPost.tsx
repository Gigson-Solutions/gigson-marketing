import type { Post } from '../../../lib/posts';
import { Link } from '../../../i18n/navigation';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
};

type Props = { post: Post };

const BlogPost = ({ post }: Props) => (
  <article className="px-landing mt-fixed-navbar pt-14 lg:pt-20 pb-20 lg:pb-32">
    <div className="max-w-[52rem] mx-auto">
      <Link href="/blog" className="inline-block mb-8 text-purple-accents text-button hover:opacity-70 transition">
        ← Back to blog
      </Link>

      {post.coverImage?.url && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-[#f4f3ef]">
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-10">
        {post.publishedAt && (
          <time className="block text-smallTag text-dark-medium uppercase tracking-widest mb-4" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
            {post.author && ` · ${post.author}`}
          </time>
        )}
        <h1 className="text-h1 text-dark-primary leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-subtitle text-dark-medium">{post.excerpt}</p>
        )}
      </header>

      {post.contentHtml ? (
        <div
          className="prose prose-lg max-w-none text-dark-medium"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      ) : (
        <p className="text-body text-dark-medium">Content unavailable.</p>
      )}
    </div>
  </article>
);

export default BlogPost;
