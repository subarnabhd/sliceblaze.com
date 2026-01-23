'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!username || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (!supabase) {
        setError('Database connection error')
        setLoading(false)
        return
      }

      // Check if user exists
      const { data: user, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (queryError || !user) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      // Check password
      if (user.password_hash !== password) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      if (!user.is_active) {
        setError('Account is inactive. Please contact support.')
        setLoading(false)
        return
      }

      // Set session
      const session = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        business_id: user.business_id
      }

      localStorage.setItem('userSession', JSON.stringify(session))

      // Redirect to user dashboard
      router.push('/user/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/sliceblazelogo.svg" alt="SliceBlaze" width={150} height={150} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Login to your SliceBlaze account</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="your_username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ED1D33] hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#ED1D33] font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Admin Login Link */}
        <p className="text-center text-gray-500 text-sm mt-4">
          <Link href="/admin" className="text-gray-600 hover:text-[#ED1D33]">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  )
}
