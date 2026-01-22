'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { verifyLogin } from '@/lib/supabase'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Login attempt for username:', username)
      
      // Verify login credentials
      const user = await verifyLogin(username, password)
      console.log('Login response:', user)

      if (!user) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      // Store user session in localStorage
      const sessionData = {
        userId: user.id,
        businessId: user.business_id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      }
      
      console.log('Storing session:', sessionData)
      localStorage.setItem('session', JSON.stringify(sessionData))

      // Redirect based on role
      console.log('Redirecting user with role:', user.role)
      if (user.role === 'admin') {
        router.push('/sliceblaze/admin')
      } else if (user.role === 'owner') {
        router.push('/owner/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SliceBlaze</h1>
          <p className="text-red-100">Login to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 border-t border-gray-300 pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Continue as visitor?</p>
            <Link
              href="/business"
              className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              Browse Businesses
            </Link>
          </div>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-semibold mb-3">📋 Test Credentials:</p>
            <div className="space-y-2 text-xs">
              <p>👨‍💼 <strong>Admin:</strong> <code className="font-mono bg-blue-100 px-2 py-1 rounded">admin / admin123</code></p>
              <p>🏪 <strong>Owner:</strong> <code className="font-mono bg-blue-100 px-2 py-1 rounded">ujamaakoffie / password123</code></p>
              <p>👤 <strong>User:</strong> <code className="font-mono bg-blue-100 px-2 py-1 rounded">user1 / user123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
