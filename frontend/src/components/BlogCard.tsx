import Link from "next/link";
import type { BlogPost } from "../lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const api = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
  const imageUrl = post.cover?.url?.replace(/^\//, "");
  const coverUrl = imageUrl ? `${api}/${imageUrl}` : null;

  return (
    <article className="bg-zinc-900/70 border border-zinc-800 rounded-lg overflow-hidden">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={post.title}
          className="h-44 w-full object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold text-white">
          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
          {post.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <Link
            href={`/blogs/${post.slug}`}
            className="text-sm text-purple-300"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}
