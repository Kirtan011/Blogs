import React from "react";
export default function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = [];
  for (let i = 1; i <= pageCount; i++) pages.push(i);
  return (
    <div className="flex gap-2 mt-6">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded ${
            p === page
              ? "bg-purple-700 text-white"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
