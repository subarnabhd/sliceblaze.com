"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
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

  return (
    <header
      className={`w-full ${isHomePage ? "fixed" : "sticky"} top-0 h-25 flex items-center justify-center border-b border-gray-200 bg-white-900 bg-blur-5 backdrop-blur-md z-50 transition-transform duration-100 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link
        href="/"
        aria-label="Go to home"
        className="flex items-center justify-center"
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
    </header>
  );
}
