'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBusinesses, supabase } from '@/lib/supabase'

interface Business {
  id: number;
  name: string;
  username: string;
  address: string;
  location: string;
  category: string;
  business_logo: string;
  description: string;
  contact: string;
  brand_primary_color: string;
  opening_hours?: string;
}

interface Category {
  id: number
  name: string
  is_active: boolean
}

function BusinessProfileCardSkeleton() {
  return (
    
    <div className="container bg-white border border-gray-200 rounded-lg overflow-hidden h-full animate-pulse">
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

function SearchPageContent() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const searchParams = useSearchParams()
  const router = useRouter()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true)
      setError('')
      try {
        const data = (await getBusinesses()) as Business[]
        setBusinesses(data)
      } catch (err) {
        console.error('Error fetching businesses:', err)
        setError('Failed to load businesses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      if (!supabase) return

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        setCategories(data)
      }
    }

    fetchBusinesses()
    fetchCategories()
  }, [])

  // Initialize search query and category from URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('query') || '')
    const urlCategory = searchParams.get('category') || '';
    setSelectedCategory(urlCategory);

    // Auto-focus search input if focus parameter is present
    if (searchParams.get('focus') === 'true') {
      setTimeout(() => {
        const input = document.querySelector('input[name="search"]') as HTMLInputElement
        if (input) {
          input.focus()
        }
      }, 100)
      // Remove focus parameter from URL
      router.replace('/search', { scroll: false })
    }
  }, [searchParams, router])

  // Filter businesses whenever search query, category, or location changes
  useEffect(() => {
    let results = businesses

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.location?.toLowerCase().includes(q)
      )
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((b) => b.category === selectedCategory)
    }

    setFilteredBusinesses(results)
  }, [searchQuery, selectedCategory, businesses])

  const clearFilters = () => {
    setSelectedCategory('');
    // Remove category param from URL
    router.push('/search', { scroll: false });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Update URL query parameter, preserve category if set
    const params = [];
    if (value.trim()) params.push(`query=${encodeURIComponent(value)}`);
    if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
    const url = params.length ? `/search?${params.join('&')}` : '/search';
    router.push(url, { scroll: false });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission is handled by onChange, but we keep this for Enter key
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Businesses
          </h1>
          <p className="text-gray-500 text-sm">
            Browse and filter businesses by category
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for businesses, categories, descriptions, or locations..."
                className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent shadow-sm"
              />
              <button
                type={searchQuery ? "button" : "submit"}
                onClick={
                  searchQuery
                    ? () =>
                        handleSearchChange({
                          target: { value: "" },
                        } as React.ChangeEvent<HTMLInputElement>)
                    : undefined
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#ED1D33] text-white rounded-md hover:bg-[#C91828] transition font-medium text-sm"
              >
                {searchQuery ? "Clear" : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter - Prominent Display */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSelectedCategory("");
                router.push("/search", { scroll: false });
              }}
              className={`px-5 py-2.5 rounded-full font-medium transition-all cursor-pointer ${
                selectedCategory === ""
                  ? "bg-[#ED1D33] text-white shadow-md cursor-pointer"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#ED1D33] cursor-pointer hover:text-[#ED1D33]"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  // Update URL with category param, preserve search query if set
                  const params = [];
                  if (searchQuery)
                    params.push(`query=${encodeURIComponent(searchQuery)}`);
                  params.push(`category=${encodeURIComponent(cat.name)}`);
                  const url = `/search?${params.join("&")}`;
                  router.push(url, { scroll: false });
                }}
                className={`px-5 py-2.5 rounded-full font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-[#ED1D33] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#ED1D33] hover:text-[#ED1D33]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {selectedCategory && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm flex items-center gap-2"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <BusinessProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
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
                className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] transition font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {filteredBusinesses.length} Business
                  {filteredBusinesses.length !== 1 ? "es" : ""} Found
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">
                    Search results for:{" "}
                    <span className="font-semibold text-gray-800">
                      &quot;{searchQuery}&quot;
                    </span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBusinesses.map((business, idx) => (
                  <Link
                    key={business.id}
                    href={`/${business.username}`}
                    className="group"
                  >
                    <div
                      className="bg-white p-5 flex flex-col  border border-gray-200 rounded-lg  hover:shadow-lg transition overflow-hidden h-full"
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Business Image */}
                      {business.business_logo && (
                        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                          <Image
                            src={business.business_logo}
                            alt={business.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}

                      {/* Business Info */}
                      <div className="">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className="text-lg font-bold transition"
                            style={{
                              cursor: "pointer",
                              color:
                                hoveredCard === idx
                                  ? business.brand_primary_color || "#ED1D33"
                                  : "#1F2937",
                            }}
                          >
                            {business.name}
                          </h3>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-3">
                          {typeof business.category === "string" &&
                          business.category.includes(",") ? (
                            <>
                              {business.category.split(",").map((cat, i) => (
                                <span
                                  key={`badge-${i}`}
                                  className="inline-block px-3 py-1 rounded-full text-xs mr-1 last:mr-0"
                                  style={{
                                    color:
                                      business.brand_primary_color || "#ED1D33",
                                    backgroundColor:
                                      business.brand_primary_color
                                        ? `${business.brand_primary_color}1F` // 12% opacity in hex
                                        : "#ED1D331F",
                                  }}
                                >
                                  {cat.trim()}
                                </span>
                              ))}
                              {business.category.split(",").length > 1 &&
                                business.category.split(",").map((_, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span
                                      key={`bullet-${i}`}
                                      className="mx-1 align-middle"
                                    >
                                      &bull;
                                    </span>
                                  ) : null,
                                )}
                            </>
                          ) : (
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs "
                              style={{
                                color:
                                  business.brand_primary_color || "#ED1D33",
                                backgroundColor: business.brand_primary_color
                                  ? `${business.brand_primary_color}1F` // 12% opacity in hex
                                  : "#ED1D331F",
                              }}
                            >
                              {business.category || ""}
                            </span>
                          )}
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
                          {business.address}
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

                      <button
                        className="w-full px-4 py-2 mt-2 cursor-pointer group-hover:bg-[#ED1D33] rounded-lg  group-hover:text-white group-hover:border-[#ED1D33rounded-lg transition-colors text-gray-600   border border-gray-300  font-medium text-sm group-hover:text-white  group-hover:border-white   "
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/${business.username}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}

