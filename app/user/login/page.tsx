'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function UserLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!supabase) {
      setError('Database connection not available')
      setLoading(false)
      return
    }

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)

      if (error) {
        setError('Login failed: ' + error.message)
        setLoading(false)
        return
      }

      if (!users || users.length === 0) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      const user = users[0]

      // Verify password (in production, use proper password hashing)
      if (user.password_hash !== password) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      // Store user session
      localStorage.setItem('userSession', JSON.stringify({
        id: user.id,
        username: user.username,
        business_id: user.business_id
      }))

      // Redirect to dashboard
      router.push('/user/dashboard')
    } catch {
      setError('An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Login</h1>
        <p className="text-gray-600 mb-6">Sign in to manage your business</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/admin" className="text-sm text-[#ED1D33] hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}
