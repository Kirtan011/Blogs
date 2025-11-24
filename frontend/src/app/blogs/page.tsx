"use client";

import { useEffect, useState } from "react";
import { getAllPosts, getAllCategories } from "../../lib/api";
import BlogCard from "../../components/BlogCard";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  /* ------------------------------------
     LOAD CATEGORIES ONCE
  ------------------------------------ */
  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  /* ------------------------------------
     LOAD POSTS
  ------------------------------------ */
  useEffect(() => {
    setLoading(true);
    const loadPosts = async () => {
      try {
        const res = await getAllPosts(page, query, selectedCategory);
        setPosts(res.posts || []);
        setPageCount(res.pagination?.pageCount || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [page, query, selectedCategory]);

  return (
    <div className="px-6 md:px-12 py-16">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-white mb-8">All Blogs</h1>

      {/* -------------------
          SEARCH + CATEGORY
      -------------------- */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        {/* SEARCH BOX */}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search blogs..."
          className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm w-full md:w-80 text-white"
        />

        {/* CATEGORY FILTER */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm text-white w-full md:w-56"
        >
          <option value="">All Categories</option>

          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* -------------------
          BLOG GRID
      -------------------- */}
      {loading ? (
        <Loader />
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-lg text-center">No blogs found.</p>
      )}

      {/* -------------------
          PAGINATION
      -------------------- */}
      <div className="mt-12 flex justify-center">
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>
    </div>
  );
}
