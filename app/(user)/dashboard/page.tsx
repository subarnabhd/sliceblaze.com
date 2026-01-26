'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Business {
  id: number
  name: string
  username: string
  address: string
  category: string
  phone: string
  email: string
  description: string
  website: string
  opening_hours: string
  logo_url: string
  cover_image_url: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  primary_color: string
  secondary_color: string
  is_active: boolean
}

interface User {
  id: number
  username: string
  email: string
  full_name: string
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalMenuItems: 0,
    totalWifiNetworks: 0
  })

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(session)
    setUser(userData)
    fetchUserData(userData.id)
  }, [router])

  const fetchUserData = async (userId: number) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      // Fetch user's businesses
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)

      const userBusinesses = businessData || []
      setBusinesses(userBusinesses)

      // Fetch statistics
      const businessIds = userBusinesses.map(b => b.id)
      
      let menuCount = 0
      let wifiCount = 0

      if (businessIds.length > 0) {
        const { data: menuData } = await supabase
          .from('menu_items')
          .select('id')
          .in('business_id', businessIds)

        const { data: wifiData } = await supabase
          .from('wifi_networks')
          .select('id')
          .in('business_id', businessIds)

        menuCount = menuData?.length || 0
        wifiCount = wifiData?.length || 0
      }

      setStats({
        totalBusinesses: userBusinesses.length,
        activeBusinesses: userBusinesses.filter(b => b.is_active).length,
        totalMenuItems: menuCount,
        totalWifiNetworks: wifiCount
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.full_name?.split(' ')[0] || user.username}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Manage your businesses and grow your online presence</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Businesses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBusinesses}</p>
                <p className="text-sm text-green-600 mt-1">{stats.activeBusinesses} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMenuItems}</p>
                <p className="text-sm text-gray-500 mt-1">Across all businesses</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">WiFi Networks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalWifiNetworks}</p>
                <p className="text-sm text-gray-500 mt-1">Configured</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📶</span>
              </div>
            </div>
          </div>

          <Link
            href="/add-business"
            className="bg-gradient-to-br from-[#ED1D33] to-red-600 rounded-xl shadow-sm p-6 border border-red-300 hover:shadow-md transition group cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <span className="text-3xl">➕</span>
              </div>
              <p className="text-white font-semibold text-lg">Add New Business</p>
              <p className="text-red-100 text-sm mt-1">Start growing today</p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/add-business"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <span className="text-xl">🏢</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Create Business</p>
                <p className="text-sm text-gray-600">Set up a new business profile</p>
              </div>
            </Link>

            <Link
              href="/my-businesses"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">My Businesses</p>
                <p className="text-sm text-gray-600">View and manage all businesses</p>
              </div>
            </Link>

            <Link
              href={`/${user.username}`}
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">View Profile</p>
                <p className="text-sm text-gray-600">See your public profile</p>
              </div>
            </Link>
          </div>
        </div>

        {/* My Businesses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Businesses</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your business profiles</p>
            </div>
            <Link
              href="/add-business"
              className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Add Business
            </Link>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses yet</h3>
              <p className="text-gray-600 mb-6">Create your first business to get started</p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                <span>➕</span>
                Create Your First Business
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  {/* Cover Image */}
                  <div 
                    className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 relative"
                    style={{
                      backgroundImage: business.cover_image_url ? `url(${business.cover_image_url})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        business.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={business.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏢</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{business.name}</h3>
                        <p className="text-sm text-gray-600">@{business.username}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {business.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📂</span>
                          <span className="truncate">{business.category}</span>
                        </div>
                      )}
                      {business.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📍</span>
                          <span className="truncate">{business.address}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📞</span>
                          <span className="truncate">{business.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/${business.username}`}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/my-businesses?edit=${business.id}`}
                        className="flex-1 px-3 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition text-center text-sm font-medium"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
              <p className="text-gray-900 font-medium">{user.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
              <p className="text-gray-900 font-medium">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
