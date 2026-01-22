"use client";

import Profilecard from "@/components/Profilecard";
import { businesses } from "@/data/businesses";
import { useState, useMemo } from "react";

const business = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name", "category", "location"

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  return (
    <div className="container mx-auto my-12 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Explore Business</h1>
      <p className="text-lg text-gray-500 text-center mt-2">
        Business digitized with SliceBlaze
      </p>

      {/* Search and Sort Container */}
      <div className="mt-8 w-full max-w-2xl">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-semibold whitespace-nowrap">Sort by:</label>
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "name", label: "📝 Name (A-Z)" },
              { value: "category", label: "🏷️ Category" },
              { value: "location", label: "📍 Location" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  sortBy === option.value
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="mt-4 text-gray-600">
        Found {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? "es" : ""}
      </p>

      {/* Business Cards */}
      <div className="flex flex-wrap justify-center gap-5 mt-10">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <Profilecard
              key={business.id}
              username={business.username}
              name={business.name}
              location={business.location}
              category={business.category}
              image={business.image || "/sample.svg"}
            />
          ))
        ) : (
          <p className="text-gray-500 text-lg mt-10">No businesses found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default business;
