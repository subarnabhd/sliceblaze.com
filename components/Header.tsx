"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

interface UserSession {
  id: number;
  username: string;
  email: string;
  full_name: string;
  business_id: number | null;
}

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Check for logged-in user
  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        setUser(JSON.parse(userSession));
      } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 0);
      
      // On home page, hide header when at top
      if (isHomePage) {
        setIsVisible(currentScrollY > 0);
      } else {
        setIsVisible(true);
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header
      className={`w-full flex justify-center sticky top-0 z-50 transition-all duration-200 ease-in-out border-b ${
        isScrolled
          ? "py-4 bg-transparent border-transparent"
          : "py-0 bg-[#ffffffd1] backdrop-blur-md border-gray-200"
      }`}
    >
      <div className="conatiner flex justify-between w-full max-w-[1350px]">
        <div
          className={`flex justify-between items-center w-full transition-all duration-200 ease-in-out border rounded-2xl ${
            isScrolled
              ? "max-w-[1350px] border-gray-200 bg-white/70 drop-shadow-xl backdrop-blur-lg md:px-4 lg:px-4 px-4 lg:py-3 py-4"
              : "px-8 py-6 border-transparent"
          }`}
        >
          <Link
            href="/"
            aria-label="Go to home"
            className="flex items-center justify-center shrink-0"
          >
            <Image
              src="/sliceblazelogo.svg"
              alt="SliceBlaze logo"
              width={80}
              height={30}
              priority
              className="cursor-pointer"
            />
          </Link>

          {/* Right - User Profile or Login */}
          <div className="shrink-0 w-auto flex justify-end ml-auto">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ED1D33] flex items-center justify-center text-white font-semibold">
                    {user.full_name?.charAt(0).toUpperCase() ||
                      user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-800">
                      {user.full_name || user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/user/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </Link>

                    {user.business_id && (
                      <Link
                        href="/user/dashboard?tab=business"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Business
                      </Link>
                    )}

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#ED1D33] hover:bg-red-50 transition w-full text-left"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-[#ED1D33] text-white text-sm font-semibold rounded-lg hover:bg-[#C91828] transition-colors shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
