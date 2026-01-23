"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    // On non-home pages, always show header
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    // On home page, reset to hidden initially
    setIsVisible(false);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to business page with search query (accessible to public)
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`w-full ${isHomePage ? "fixed" : "sticky"} top-0 h-25 flex items-center justify-between px-8 border-b border-gray-200 bg-white-900 bg-blur-5 backdrop-blur-md z-50 transition-transform duration-100 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Left - Logo */}
      <Link
        href="/"
        aria-label="Go to home"
        className="flex items-center justify-center shrink-0"
      >
        <Image
          src="/sliceblazelogo.svg"
          alt="SliceBlaze logo"
          width={120}
          height={90}
          priority
          className="cursor-pointer"
        />
      </Link>

      {/* Center - Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search businesses..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Right - User Login Link */}
      <div className="shrink-0 w-24 flex justify-end">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#ED1D33] transition"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
