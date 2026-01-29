'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/auth'



export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
    setGoogleLoading(false);
  };

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


        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg shadow transition disabled:opacity-50 mb-4 hover:bg-[#f5f5f5] hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-[#4285F4] focus:outline-none cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.36 46.1 31.41 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 16.18 0 19.97 0 24c0 4.03.99 7.82 2.69 12.04l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.03 15.54-5.53l-7.19-5.59c-2.01 1.35-4.59 2.13-8.35 2.13-6.43 0-11.87-3.63-14.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
        </button>

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

