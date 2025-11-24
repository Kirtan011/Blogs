"use client";

import { useEffect, useState } from "react";
import { getAllPosts, getAllCategories } from "../lib/api";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  function getImageUrl(path?: string) {
    if (!path) return undefined;
    const base = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
    const clean = path.replace(/^\//, "");
    return `${base}/${clean}`;
  }

  /* --------------------------
     Load categories
  --------------------------- */
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCats();
  }, []);

  /* --------------------------
     Load ALL Posts
  --------------------------- */
  useEffect(() => {
    setLoading(true);
    const loadPosts = async () => {
      try {
        const res = await getAllPosts(1, query, selectedCategory);
        setPosts(res.posts || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadPosts();
  }, [query, selectedCategory]);

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-20">
      {/* --------------------------
          HERO SECTION
      --------------------------- */}
      <section className="pt-24 pb-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-widest text-white mb-4">
          All Blogs
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Explore blogs from all categories — scroll through each section
          horizontally.
        </p>
      </section>

      {/* --------------------------
          SEARCH + FILTER
      --------------------------- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm w-full md:w-72 text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm text-white w-full md:w-56"
        >
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* --------------------------
          CATEGORY WISE BLOG CAROUSEL
      --------------------------- */}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-20">
          {categories.map((cat: any) => {
            const filteredPosts = posts.filter((p: any) =>
              p.categories?.some((c: any) => c.slug === cat.slug)
            );

            if (filteredPosts.length === 0) return null;

            return (
              <section key={cat.id}>
                <h2 className="text-3xl font-bold mb-4 text-purple-300">
                  {cat.name}
                </h2>

                {/* Horizontal scroll */}
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                  {filteredPosts.map((post: any) => (
                    <div key={post.id} className="min-w-[300px] max-w-[300px]">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
