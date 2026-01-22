'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
}

interface SessionData {
  userId: number
  username: string
  fullName: string
  role: string
  email: string
}

export default function UserDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('session')
    if (!session) {
      router.push('/sliceblaze/login')
      return
    }

    const user: SessionData = JSON.parse(session)
    // Use displayName directly instead of setting state
    const displayName = user.fullName || user.username

    // Fetch businesses
    const fetchBusinesses = async () => {
      const data = await getBusinesses()
      setBusinesses(data)
      setUserName(displayName)
      setLoading(false)
    }

    fetchBusinesses()
  }, [router])

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('session')
    router.push('/sliceblaze/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-red-600">SliceBlaze</h1>
            <p className="text-sm text-gray-600">Welcome, {userName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search businesses by name, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Link key={business.id} href={`/business/${business.username}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full overflow-hidden">
                {/* Business Image */}
                <div className="relative h-48 w-full bg-gray-200">
                  {business.image ? (
                    <Image
                      src={business.image}
                      alt={business.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                      No Image
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                  <p className="text-sm text-gray-600 mb-3">{business.location}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{business.description}</p>

                  {/* View Button */}
                  <button
                    style={{
                      backgroundColor: business.brandPrimaryColor || '#ED1D33',
                    }}
                    className="w-full mt-4 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No businesses found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </main>
    </div>
  )
}
