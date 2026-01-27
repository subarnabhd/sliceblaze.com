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

interface CategoryWithCount {
  name: string;
  icon: string;
  count: number;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserSession | null>(() => {
    // Initialize user from localStorage
    if (typeof window !== 'undefined') {
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        try {
          return JSON.parse(userSession);
        } catch (error) {
          console.error('Error parsing user session:', error);
          localStorage.removeItem('userSession');
        }
      }
    }
    return null;
  });
  const [userBusiness, setUserBusiness] = useState<UserBusiness | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const fetchCategories = async () => {
    if (!supabase) return;

    try {
      // Fetch all categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('name, icon')
        .order('name', { ascending: true });

      // Fetch all active businesses
      const { data: businesses } = await supabase
        .from('businesses')
        .select('category')
        .eq('is_active', true);

      // Count businesses by category
      const counts: Record<string, number> = {};
      businesses?.forEach(b => {
        if (b.category) {
          counts[b.category] = (counts[b.category] || 0) + 1;
        }
      });

      // Combine categories with counts - show all categories
      const categoriesWithCount = (categoriesData || []).map(cat => ({
        name: cat.name,
        icon: cat.icon || '🏪',
        count: counts[cat.name] || 0
      }));

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const checkUserBusiness = async (userId: number) => {
    if (!supabase) return;

    try {
      const { data } = await supabase
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
    } catch {
      // No business found
      setUserBusiness(null);
    }
  };

  // Check if user has a business when user changes
  useEffect(() => {
    if (user?.id) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      checkUserBusiness(user.id);
    }
  }, [user?.id]);

  // Fetch categories with business counts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (businessDropdownRef.current && !businessDropdownRef.current.contains(event.target as Node)) {
        setBusinessDropdownOpen(false);
      }
    };

    if (dropdownOpen || businessDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen, businessDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 0);
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
    window.location.href = '/';
  };

  return (
    <header
      className={`w-full flex justify-center sticky top-0 z-50 transition-all duration-200 ease-in-out  ${
        isScrolled
          ? "p-4 bg-transparent border-transparent"
          : "py-0 bg-[#ffffffd1] backdrop-blur-md border-gray-200"
      }`}
    >
      <div className="container justify-between w-full max-w-280">
        <div
          className={`grid grid-cols-3 items-center w-full transition-all duration-200 ease-in-out border rounded-2xl ${
            isScrolled
              ? "container border-gray-200 bg-white/70 drop-shadow-xl backdrop-blur-lg md:px-4 lg:px-4 px-4 lg:py-4 py-3"
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

            {/* Business Dropdown */}
            <div className="relative pointer-events-auto" ref={businessDropdownRef}>
              <button
                onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#ED1D33] font-medium transition-colors pointer-events-auto"
              >
                Business
                <svg
                  className={`w-4 h-4 transition-transform ${businessDropdownOpen ? "rotate-180" : ""}`}
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

              {businessDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60] pointer-events-auto">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-700">
                      Browse by Category
                    </p>
                  </div>

                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/search?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setBusinessDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="group-hover:text-[#ED1D33] transition-colors">
                            {category.name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold group-hover:bg-[#ED1D33] group-hover:text-white transition-colors">
                          {category.count}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No categories available
                    </div>
                  )}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/search"
                      onClick={() => setBusinessDropdownOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-[#ED1D33] hover:bg-red-50 transition font-medium"
                    >
                      View All Businesses
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/search"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Explore
            </Link>

            <Link
              href="/features"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors"
            >
              Features
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#ED1D33] font-medium transition-colors pointer-events-auto relative z-10"
            >
              Contact
            </Link>
          </nav>

          {/* Right - User Profile or Login */}
          <div className="flex justify-end items-center gap-3">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-[#ED1D33] transition-all"
              aria-label="Open menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>

            {/* Desktop User Menu */}
            {user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
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
                      <p className="text-sm font-semibold text-gray-900">
                        {user.email}
                      </p>
                    </div>

                    {/* Business Ownership Status */}
                    {userBusiness ? (
                      <div className="px-4 py-3 bg-green-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-green-700">
                            🎯 Manage Your Business
                          </span>
                          {userBusiness.is_active && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          Building Business online presence!
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-blue-700">
                            🎯 Create Your Business
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Start building your online presence today!
                        </p>
                      </div>
                    )}

                    {/* 1. Dashboard */}
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

                    {/* 2. Create Business/Business Profile */}
                    {userBusiness ? (
                      <Link
                        href={`/${userBusiness.username}`}
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
                        Business Profile
                      </Link>
                    ) : (
                      <Link
                        href="/add-business"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Create Business
                      </Link>
                    )}

                    {/* 3. My Profile */}
                    <Link
                      href={`/profile/${user.username}`}
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
                      My Profile
                    </Link>

                    {/* 4. Change Password */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard");
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent("openChangePassword"),
                          );
                        }, 100);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition w-full text-left"
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
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                      Change Password
                    </button>

                    <hr className="my-2 border-gray-200" />

                    {/* 5. Logout */}
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
                className="hidden md:inline-block px-6 py-2.5 bg-[#ED1D33] text-white text-sm font-semibold rounded-lg hover:bg-[#C91828] transition-colors shadow-sm hover:shadow-md"
              >
                LOGIN / SIGNUP
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Image
              src="/sliceblazelogo.svg"
              alt="SliceBlaze logo"
              width={90}
              height={30}
              priority
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700 hover:text-[#ED1D33] transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="p-6 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors font-medium"
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
              Home
            </Link>

            {/* Business Categories in Mobile Menu */}
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              <div className="max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/search?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors font-medium"
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
              Explore
            </Link>

            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors font-medium"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Features
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors font-medium"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu User Section */}
          <div className="border-t border-gray-200 p-6">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ED1D33] flex items-center justify-center text-white font-semibold">
                      {user.full_name?.charAt(0).toUpperCase() ||
                        user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.full_name || user.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors"
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
                    href={`/${userBusiness.username}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors"
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
                    Business Profile
                  </Link>
                ) : (
                  <Link
                    href="/add-business"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors"
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
                  href={`/profile/${user.username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ED1D33] rounded-lg transition-colors"
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
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-[#ED1D33] hover:bg-red-50 rounded-lg transition-colors w-full"
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
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-linear-to-r from-[#ED1D33] to-red-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
