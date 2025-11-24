"use client";
import { useState } from "react";

export default function BlockEditor({ value, onChange }: any) {
  const [text, setText] = useState("");

  // Convert simple text → Strapi blocks
  const convertToBlocks = (content: string) => {
    return content.split("\n").map((line) => ({
      type: "paragraph",
      children: [{ type: "text", text: line }],
    }));
  };

  const handleChange = (val: string) => {
    setText(val);
    onChange(convertToBlocks(val));
  };

  return (
    <textarea
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Write your blog content... "
      className="w-full h-64 bg-zinc-900/70 border border-zinc-700 rounded p-4 text-white"
    />
  );
}
