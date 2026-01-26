'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (!supabase) {
        setError('Database connection error')
        setLoading(false)
        return
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        setError('Email already registered')
        setLoading(false)
        return
      }

      // Check if username is taken
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUsername) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      // Create user
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email,
            username: username.toLowerCase(),
            full_name: fullName,
            password_hash: password, // In production, hash this!
            role: 'owner',
            is_active: true,
          },
        ])

      if (insertError) {
        setError('Registration failed: ' + insertError.message)
        setLoading(false)
        return
      }

      // Fetch the created user
      const { data: newUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (newUser) {
        // Store session
        localStorage.setItem(
          'session',
          JSON.stringify({
            userId: newUser.id,
            businessId: newUser.business_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            fullName: newUser.full_name,
          })
        )

        // Redirect to user dashboard
        router.push('/user/my-businesses')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#ED1D33] to-[#A01520] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        {/* Logo */}
        <Link
          className="m-auto pb-5 flex w-full justify-center"
          href="/"
          aria-label="Go to home"
        >
          <Image
            src="/sliceblazelogo.svg"
            alt="SliceBlaze"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>

        {/* Title */}
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Fuel the Blaze
          </h2>
          <p className="text-center text-gray-600 text-sm mt-2">
            Join Sliceblaze & manage your business
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-[#ED1D33] hover:bg-[#C91828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1D33] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#ED1D33] hover:text-[#C91828] font-medium"
          >
            Login
          </Link>
        </p>

        {/* Home Link */}
        <p className="text-center text-gray-600 text-sm">
          <Link
            href="/"
            className="text-[#ED1D33] hover:text-[#C91828] font-medium"
          >
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

