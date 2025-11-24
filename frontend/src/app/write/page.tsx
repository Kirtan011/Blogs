"use client";

import { useEffect, useState } from "react";
import {
  createPost,
  uploadImage,
  attachCoverImage,
  getAllCategories,
  attachCategory,
  getPostById,
} from "../../lib/api";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* RESTORE DRAFT */
  useEffect(() => {
    const saved = localStorage.getItem("draft_blog");
    if (saved) {
      const data = JSON.parse(saved);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setContent(data.content || "");
      setSelectedCategory(data.selectedCategory || "");
    }
  }, []);

  /* SAVE DRAFT */
  useEffect(() => {
    localStorage.setItem(
      "draft_blog",
      JSON.stringify({
        title,
        description,
        content,
        selectedCategory,
      })
    );
  }, [title, description, content, selectedCategory]);

  /* AUTO SLUG */
  useEffect(() => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  }, [title]);

  /* LOAD CATEGORIES */
  useEffect(() => {
    const load = async () => {
      const cats = await getAllCategories();
      setCategories(cats || []);
    };
    load();
  }, []);

  /* SUBMIT */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blocks = [
        { type: "paragraph", children: [{ type: "text", text: content }] },
      ];

      // 1️⃣ Create base post
      const newPost = await createPost({
        title,
        slug,
        description,
        content: blocks,
      });

      // 2️⃣ Add image
      if (file) {
        const uploaded = await uploadImage(file);
        await attachCoverImage(newPost.id, uploaded.id);
      }

      // 3️⃣ Add category
      if (selectedCategory) {
        await attachCategory(newPost.id, Number(selectedCategory));
      }

      // 4️⃣ Clear draft
      localStorage.removeItem("draft_blog");

      // 5️⃣ Fetch full post (Strapi v5 does NOT return slug immediately)
      const fresh = await getPostById(newPost.id);

      router.push(`/blogs/${fresh.slug}`);
    } catch (err) {
      console.error("❌ ERROR creating post:", err);
      alert("Failed to publish blog.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-12 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          className="w-full bg-zinc-900/70 px-4 py-2 border border-zinc-700 rounded"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-zinc-900/70 px-4 py-2 border border-zinc-700 rounded"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <textarea
          className="w-full bg-zinc-900/70 px-4 py-2 border border-zinc-700 rounded h-60"
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className="w-full bg-zinc-900/70 px-4 py-2 border border-zinc-700 rounded text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Choose Category --</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div>
          <label className="text-sm text-zinc-300">Cover Image:</label>
          <input
            type="file"
            className="mt-2 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded text-white"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}
