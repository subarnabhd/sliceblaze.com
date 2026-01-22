'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBusinesses } from '@/lib/supabase'

interface Business {
  id: number
  name: string
  username: string
  location: string
  category: string
  image: string
  description: string
  contact: string
  brandPrimaryColor: string
  openingHours?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('search') || ''

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true)
      const data = await getBusinesses()
      setBusinesses(data)

      // Extract unique categories and locations
      const uniqueCategories = [...new Set(data.map((b) => b.category).filter(Boolean))]
      const uniqueLocations = [...new Set(data.map((b) => b.location).filter(Boolean))]

      setCategories(uniqueCategories.sort())
      setLocations(uniqueLocations.sort())
      setLoading(false)
    }

    fetchBusinesses()
  }, [])

  // Filter businesses whenever search query, category, or location changes
  useEffect(() => {
    let results = businesses

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((b) => b.category === selectedCategory)
    }

    // Filter by location
    if (selectedLocation) {
      results = results.filter((b) => b.location === selectedLocation)
    }

    setFilteredBusinesses(results)
  }, [searchQuery, selectedCategory, selectedLocation, businesses])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const clearFilters = () => {
    setSearchQuery(initialQuery)
    setSelectedCategory('')
    setSelectedLocation('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses by name, description, or category..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-40">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory || selectedLocation || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">Loading businesses...</div>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No businesses found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {filteredBusinesses.length} Business{filteredBusinesses.length !== 1 ? 'es' : ''} Found
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBusinesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/business/${business.username}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full">
                        {/* Business Image */}
                        {business.image && (
                          <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                            <Image
                              src={business.image}
                              alt={business.name}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        )}

                        {/* Business Info */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition">
                              {business.name}
                            </h3>
                            {business.brandPrimaryColor && (
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: business.brandPrimaryColor }}
                                title="Brand Color"
                              />
                            )}
                          </div>

                          {/* Category Badge */}
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                              {business.category}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {business.description}
                          </p>

                          {/* Location */}
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {business.location}
                          </div>

                          {/* Contact */}
                          {business.contact && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              {business.contact}
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <div className="px-5 pb-5">
                          <button
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                            onClick={(e) => {
                              e.preventDefault()
                              router.push(`/business/${business.username}`)
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
