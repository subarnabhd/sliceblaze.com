"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface CategoryCounter {
  category: string;
  count: number;
  icon: string;
  description?: string;
  image_url?: string;
}

const CategoryCounter = () => {
  const [CategoryCounters, setCategoryCounters] = useState<CategoryCounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryCounters();
  }, []);

  const fetchCategoryCounters = async () => {
    if (!supabase) return;

    try {
      // Fetch all categories with their icons, descriptions, and images
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("name, icon, description, image_url")
        .order("name", { ascending: true });

      // Fetch all active businesses
      const { data: businesses, error } = await supabase
        .from("businesses")
        .select("category")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching businesses:", error);
        return;
      }

      // Count businesses by category
      const counts: Record<string, number> = {};
      businesses?.forEach((business) => {
        const category = business.category || "Other";
        counts[category] = (counts[category] || 0) + 1;
      });

      let categoryArray: CategoryCounter[];

      // If we have categories from database, use them
      if (categories && categories.length > 0 && !catError) {
        categoryArray = categories.map((cat) => ({
          category: cat.name,
          count: counts[cat.name] || 0,
          icon: cat.icon || "??",
          description: cat.description,
          image_url: cat.image_url,
        }));
      } else {
        // Fallback: use categories from businesses with default icons
        const defaultIcons: Record<string, string> = {
          Restaurant: "???",
          Cafe: "?",
          Bar: "??",
          "Fast Food": "??",
          Bakery: "??",
          Pizza: "??",
          Other: "??",
        };

        categoryArray = Object.entries(counts).map(([category, count]) => ({
          category,
          count,
          icon: defaultIcons[category] || "??",
        }));
      }

      // Sort by count (highest first)
      categoryArray.sort((a, b) => b.count - a.count);

      setCategoryCounters(categoryArray);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-linear-to-b from-white to-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-5 border-2 border-gray-100 animate-pulse"
              >
                <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (CategoryCounters.length === 0) {
    return (
      <div className="bg-linear-to-b from-white to-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
            <div className="text-6xl mb-4">??</div>
            <p className="text-xl text-gray-500 font-medium">
              No categories found
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check back soon for new businesses
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-red-100 text-[#ED1D33] text-sm font-semibold rounded-full mb-4">
            Categories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for. Browse businesses by
            category and discover local favorites.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {CategoryCounters.map((item) => (
            <Link
              key={item.category}
              href={`/search?category=${encodeURIComponent(item.category)}`}
              className="group relative bg-white rounded-2xl shadow-sm border-2 border-gray-100 hover:border-[#ED1D33]  hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Category Image Background */}
              {item.image_url ? (
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.category}
                    width={400}
                    height={128}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Icon on Image */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                  </div>

                  {/* Count Badge on Image */}
                  <div className="absolute bottom-3 right-3">
                    <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full shadow-lg text-xs font-bold">
                      <span>{item.count}</span>
                      <span className="opacity-70">
                        {item.count === 1 ? "place" : "places"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback: Icon-only design */
                <div className="relative p-5">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Icon with animated background */}
                  <div className="relative inline-block mb-3 w-full text-center">
                    <div
                      className="absolute inset-0 bg-red-50 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300 mx-auto"
                      style={{
                        width: "64px",
                        height: "64px",
                        left: "calc(50% - 32px)",
                      }}
                    ></div>
                    <div className="relative text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div
                className={`relative ${item.image_url ? "p-4" : "px-5 pb-5"}`}
              >
                {/* Category name */}
                <h3
                  className={`text-sm md:text-base font-bold group-hover:text-[#ED1D33] transition-colors mb-2 line-clamp-1 ${item.image_url ? "text-gray-900" : "text-gray-900 text-center"}`}
                >
                  {item.category}
                </h3>

                {/* Description (if exists and no image) */}
                {item.description && !item.image_url && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 text-center min-h-8">
                    {item.description}
                  </p>
                )}

                {/* Count badge (only for non-image cards) */}
                {!item.image_url && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 bg-linear-to-r from-[#ED1D33] to-red-600 text-white px-3 py-1.5 rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                      <span className="text-base md:text-lg font-bold">
                        {item.count}
                      </span>
                      <span className="text-[10px] md:text-xs font-medium opacity-90">
                        {item.count === 1 ? "place" : "places"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-[#ED1D33]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-[#ED1D33] transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            View All Businesses
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCounter;
