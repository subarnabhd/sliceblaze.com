'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserSession } from '@/lib/auth'
import Link from 'next/link'

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  business_id: number | null
  created_at: string
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [username])

  const fetchUserProfile = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      // Fetch user by username
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, username, email, full_name, role, business_id, created_at')
        .eq('username', username)
        .single()

      if (error || !userData) {
        console.error('User not found:', error)
        setLoading(false)
        return
      }

      setUser(userData)

      // Check if this is the logged-in user's own profile
      const session = getUserSession()
      if (session && session.username === username) {
        setIsOwnProfile(true)
      }

      // If user has a business, redirect to business profile
      if (userData.business_id) {
        const { data: businessData } = await supabase
          .from('businesses')
          .select('username')
          .eq('id', userData.business_id)
          .single()

        if (businessData) {
          router.push(`/${businessData.username}`)
          return
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            The user profile you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-[#ED1D33] to-red-600"></div>
          
          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-[#ED1D33] flex items-center justify-center text-white text-4xl font-bold">
                  {user.full_name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {isOwnProfile && (
                <Link
                  href="/dashboard"
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.full_name || user.username}
                </h2>
                <p className="text-gray-600 text-lg">@{user.username}</p>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Account Type</p>
                  <p className="text-gray-900">
                    {user.business_id ? 'Business Owner' : 'User'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Member Since</p>
                  <p className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
                  <p className="text-gray-900">@{user.username}</p>
                </div>
              </div>

              {/* Call to Action */}
              {!user.business_id && isOwnProfile && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready to grow your business?
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Create your business profile and start connecting with customers today!
                      </p>
                      <Link
                        href="/add-business"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        <span>➕</span>
                        Create Your Business
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {isOwnProfile && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/dashboard"
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Go to Dashboard
                    </Link>
                    {!user.business_id && (
                      <Link
                        href="/add-business"
                        className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        Create Business
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {isOwnProfile && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-medium text-gray-900">Dashboard</p>
                  <p className="text-sm text-gray-600">View overview</p>
                </div>
              </Link>

              <Link
                href="/search"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-medium text-gray-900">Explore</p>
                  <p className="text-sm text-gray-600">Find businesses</p>
                </div>
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium text-gray-900">Contact</p>
                  <p className="text-sm text-gray-600">Get help</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
