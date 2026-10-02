import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  tags: string[] | null;
};

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      to={ROUTES.blogPost(post.slug)}
      className="block rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {post.published_at && (
        <p className="text-xs text-neutral-400">{formatDate(post.published_at)}</p>
      )}
      <h3 className="mt-2 font-heading text-lg font-semibold text-neutral-900">{post.title}</h3>
      {post.excerpt && <p className="mt-2 text-sm text-neutral-700">{post.excerpt}</p>}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs text-primary-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

