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

function BusinessCardSkeleton() {
  return (
    
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true)
      setError('')
      try {
        const data = (await getBusinesses()) as Business[]
        setBusinesses(data)

        // Extract unique categories and locations
        const uniqueCategories = [...new Set(data.map((b) => b.category).filter((c): c is string => !!c))]
        const uniqueLocations = [...new Set(data.map((b) => b.location).filter((l): l is string => !!l))]

        setCategories(uniqueCategories.sort())
        setLocations(uniqueLocations.sort())
      } catch (err) {
        console.error('Error fetching businesses:', err)
        setError('Failed to load businesses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  // Filter businesses whenever search query, category, or location changes
  useEffect(() => {
    const query = searchParams.get('query') || ''
    let results = businesses

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
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
  }, [searchParams, selectedCategory, selectedLocation, businesses])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedLocation('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
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
            <div>
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
            {(selectedCategory || selectedLocation) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBusinesses.map((business) => (
                    <Link
                      key={business.id}
                      href={`/${business.username}`}
                      className="group"
                    >
                      <div className="bg-white p-5 border border-gray-200 rounded-lg  hover:shadow-lg transition overflow-hidden h-full">
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
                                className="w-4 h-4 rounded-full shrink-0"
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
  )
}
