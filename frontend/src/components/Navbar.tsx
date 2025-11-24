"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`
        fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-800 ease-out
        ${
          isScrolled
            ? "top-4 w-[95%] sm:w-[90%] md:w-[80%]  lg:w-[65%] xl:w-[50% py-2 bg-gray-400/30 backdrop-blur-lg shadow-xl rounded-full"
            : "top-1 w-full py-4 bg-gray-400/20 backdrop-blur-lg border-0.5 rounded-none"
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white hover:text-purple-400 transition"
        >
          My Blog
        </Link>

        <div className="flex items-center space-x-6 text-sm">
          <Link
            href="/"
            className="text-zinc-300 active:text-white hover:text-white transition"
          >
            Blogs
          </Link>
          <Link
            href="/blogs"
            className="text-zinc-300 active:text-white hover:text-white transition"
          >
            All Blogs
          </Link>

          <Link
            href="/write"
            className="text-zinc-300 hover:text-white transition"
          >
            Publish Your Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
