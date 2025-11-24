"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPostBySlug } from "../../../lib/api";
import Loader from "../../../components/Loader";
import moment from "moment";

export default function BlogPostPage() {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";

  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch blog
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const p = await getPostBySlug(slug);
        setPost(p);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <Loader />;
  if (!post) return <p className="text-center text-zinc-400">No post found.</p>;

  // Safe image URL
  const api = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
  const imageUrl = post.cover?.url?.replace(/^\//, "");

  return (
    <div className=" mt-14 max-w-screen-md mx-auto pb-20">
      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="text-sm text-zinc-400 mb-5">
        Published {moment(post.createdAt).fromNow()}
      </div>

      {/* Categories */}
      {post.categories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((c: any) => (
            <span
              key={c.id}
              className="bg-purple-900/40 text-purple-300 border border-purple-800 px-3 py-1 rounded-md text-xs"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Cover Image */}
      {imageUrl && (
        <div className="w-full overflow-hidden rounded-xl shadow-lg mb-8">
          <img
            src={`${api}/${imageUrl}`}
            alt={post.title}
            className="w-full h-100 object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-zinc-300 leading-relaxed mb-10 italic">
        {post.description}
      </p>

      {/* Content */}
      {post.content && (
        <article className="prose prose-invert prose-lg max-w-none leading-relaxed text-zinc-200">
          {post.content?.map((block: any, i: number) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={i}>
                    {block.children?.map((child: any, j: number) => (
                      <span key={j}>{child.text}</span>
                    ))}
                  </p>
                );

              case "heading":
                const H = `h${block.level}` as any;
                return (
                  <H
                    key={i}
                    className="mt-8 mb-4 text-3xl font-extrabold text-white"
                  >
                    {block.children?.map((c: any) => c.text).join(" ")}
                  </H>
                );

              case "quote":
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-purple-400 pl-4 italic text-purple-200"
                  >
                    {block.children?.map((c: any) => c.text).join(" ")}
                  </blockquote>
                );

              case "list":
                return block.format === "ordered" ? (
                  <ol key={i} className="list-decimal ml-6">
                    {block.children?.map((li: any, j: number) => (
                      <li key={j}>
                        {li.children?.map((c: any) => c.text).join(" ")}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul key={i} className="list-disc ml-6">
                    {block.children?.map((li: any, j: number) => (
                      <li key={j}>
                        {li.children?.map((c: any) => c.text).join(" ")}
                      </li>
                    ))}
                  </ul>
                );

              case "image":
                const base =
                  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "";
                return (
                  <div key={i} className="my-6">
                    <img
                      src={`${base}${block.image?.url}`}
                      alt={block.image?.alternativeText || ""}
                      className="rounded-lg shadow-lg"
                    />
                    {block.image?.caption && (
                      <p className="text-sm text-center text-zinc-400 mt-2">
                        {block.image.caption}
                      </p>
                    )}
                  </div>
                );

              case "code":
                return (
                  <pre
                    key={i}
                    className="bg-zinc-900 p-4 rounded-lg text-sm overflow-x-auto border border-zinc-700"
                  >
                    <code>{block.code}</code>
                  </pre>
                );

              default:
                return null;
            }
          })}
        </article>
      )}
    </div>
  );
}
