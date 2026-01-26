"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface UserSession {
  id: number;
  username: string;
  email: string;
  full_name: string;
  business_id: number | null;
}

interface UserBusiness {
  id: number;
  name: string;
  username: string;
  is_active: boolean;
}

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [userBusiness, setUserBusiness] = useState<UserBusiness | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // Check for logged-in user and their business
  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        setUser(userData);
        checkUserBusiness(userData.id);
      } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, [pathname]);

  // Check if user owns a business
  const checkUserBusiness = async (userId: number) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, username, is_active')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (data) {
        setUserBusiness(data);
      } else {
        setUserBusiness(null);
      }
    } catch (err) {
      // No business found
      setUserBusiness(null);
    }
  };

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
      className={`w-full flex justify-center sticky top-0 z-50 transition-all duration-200 ease-in-out  ${
        isScrolled
          ? "p-4 bg-transparent border-transparent"
          : "py-0 bg-[#ffffffd1] backdrop-blur-md border-gray-200"
      }`}
    >
      <div className="container justify-between w-full max-w-[1120px]">
        <div
          className={`grid grid-cols-3 items-center w-full transition-all duration-200 ease-in-out border rounded-2xl ${
            isScrolled
              ? "container border-gray-200 bg-white/70 drop-shadow-xl backdrop-blur-lg md:px-4 lg:px-4 px-4 lg:py-4 py-4"
              : "px-8 py-4 border-transparent"
          }`}
        >
          {/* Left - Logo */}
          <Link
            href="/"
            aria-label="Go to home"
            className="flex items-center justify-start"
          >
            <Image
              src="/sliceblazelogo.svg"
              alt="SliceBlaze logo"
              width={90}
              height={30}
              priority
              className="cursor-pointer"
            />
          </Link>

          {/* Middle - Navigation Menu */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right - User Profile or Login */}
          <div className="flex justify-end">
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                    </div>

                    {/* Business Ownership Status */}
                    {userBusiness ? (
                      <div className="px-4 py-3 bg-green-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-green-700">✓ Business Owner</span>
                          {userBusiness.is_active && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 font-medium">{userBusiness.name}</p>
                        <p className="text-xs text-gray-500">@{userBusiness.username}</p>
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-blue-700">🎯 Create Your Business</span>
                        </div>
                        <p className="text-xs text-gray-600">Start building your online presence today!</p>
                      </div>
                    )}

                    <Link
                      href="/dashboard"
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

                    {userBusiness ? (
                      <Link
                        href="/manage-business"
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Manage My Business
                      </Link>
                    ) : (
                      <Link
                        href="/add-business"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#ED1D33] hover:bg-red-50 transition font-medium"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Create Business
                      </Link>
                    )}

                    <Link
                      href={`/${user.username}`}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Profile
                    </Link>

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
