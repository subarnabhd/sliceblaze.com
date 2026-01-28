'use client'

import { Metadata } from 'next'
import { useMemo } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication redirect page for Sliceblaze.",
  robots: { index: false, follow: false },
};

interface User {
  userId: number
  businessId: number | null
  username: string
  email: string
  role: string
  fullName: string
}

export default function LoginRedirectPage() {
  const user = useMemo(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('session') : null
    return session ? (JSON.parse(session) as User) : null
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-[#ED1D33] to-[#A01520]">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#ED1D33]">SliceBlaze</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse
            </Link>
            {user ? (
              <Link href="/user/my-businesses" className="text-[#ED1D33] font-semibold">
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-[#ED1D33] text-[#ED1D33] rounded-lg hover:bg-red-50 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white">
        <h2 className="text-4xl font-bold mb-4">Welcome to SliceBlaze</h2>
        <p className="text-xl mb-8 opacity-90">Your digital storefront for restaurants and food businesses</p>

        {user ? (
          <div className="bg-white text-gray-900 rounded-lg p-8 max-w-md">
            <h3 className="text-2xl font-bold mb-4">Welcome back, {user.fullName}!</h3>
            <p className="text-gray-600 mb-6">You&apos;re logged in as <strong>{user.email}</strong></p>
            <Link
              href="/user/my-businesses"
              className="block text-center px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium mb-4"
            >
              Go to Your Dashboard
            </Link>
            <Link
              href="/"
              className="block text-center px-6 py-3 border border-[#ED1D33] text-[#ED1D33] rounded-lg hover:bg-red-50 font-medium"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* For Customers */}
            <div className="bg-white text-gray-900 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Customers</h3>
              <p className="text-gray-600 mb-6">Browse and discover restaurants and food businesses near you</p>
              <Link
                href="/search"
                className="block text-center px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium"
              >
                Browse Restaurants
              </Link>
            </div>

            {/* For Business Owners */}
            <div className="bg-white text-gray-900 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Business Owners</h3>
              <p className="text-gray-600 mb-6">Register your business and reach more customers online</p>
              <Link
                href="/register"
                className="block text-center px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium mb-3"
              >
                Register Your Business
              </Link>
              <Link
                href="/sliceblaze/login"
                className="block text-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-[#ED1D33] font-medium"
              >
                Login to Existing Account
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-white mb-8">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 text-white rounded-lg p-6">
            <h4 className="text-xl font-bold mb-2">📱 Easy Access</h4>
            <p>View all restaurants and food businesses in one place</p>
          </div>
          <div className="bg-white bg-opacity-10 text-white rounded-lg p-6">
            <h4 className="text-xl font-bold mb-2">📍 Location Based</h4>
            <p>Find businesses by location, category, and more</p>
          </div>
          <div className="bg-white bg-opacity-10 text-white rounded-lg p-6">
            <h4 className="text-xl font-bold mb-2">🎨 Customizable</h4>
            <p>Businesses can customize their profiles with images and colors</p>
          </div>
        </div>
      </div>
    </div>
  )
}

