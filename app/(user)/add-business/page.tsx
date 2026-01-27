'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserSession, refreshUserSession, isOwner } from '@/lib/auth'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  description: string
}

interface Business {
  id: number
  name: string
  username: string
  category: string
  location: string
  contact: string
  description: string
  image: string
  openinghours: string
  facebook: string
  instagram: string
  tiktok: string
  twitter: string
  youtube: string
  linkedin: string
  threads: string
  whatsapp: string
  website: string
  googlemapurl: string
  brandprimarycolor: string
  brandsecondarycolor: string
  is_active: boolean
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  is_available: boolean
}

interface WiFiNetwork {
  id: number
  network_name: string
  password: string
  notes: string
}

export default function AddBusinessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [checkingBusiness, setCheckingBusiness] = useState(true)
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    location: '',
    contact: '',
    description: '',
    image: '',
    openinghours: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    threads: '',
    whatsapp: '',
    website: '',
    googlemapurl: '',
    brandprimarycolor: '#ED1D33',
    brandsecondarycolor: '#000000',
  })

  useEffect(() => {
    checkUserSession()
  }, [router])

  const checkUserSession = async () => {
    const session = getUserSession()
    if (!session) {
      router.push('/login')
      return
    }

    // Refresh session to get latest data
    const refreshedSession = await refreshUserSession(session.id)
    if (!refreshedSession) {
      router.push('/login')
      return
    }

    // Check if user is already an owner (has a business)
    if (isOwner(refreshedSession)) {
      setExistingBusiness({ id: refreshedSession.business_id! } as Business)
      setCheckingBusiness(false)
      setLoading(false)
      return
    }

    await checkExistingBusiness(refreshedSession.id)
    await fetchCategories()
    setLoading(false)
  }

  const checkExistingBusiness = async (userId: number) => {
    if (!supabase) {
      setCheckingBusiness(false)
      return
    }

    try {
      // Check if user already has a business_id assigned
      const { data: user } = await supabase
        .from('users')
        .select('business_id, businesses(*)')
        .eq('id', userId)
        .single()

      if (user && user.business_id && user.businesses) {
        const biz = Array.isArray(user.businesses) ? user.businesses[0] : user.businesses
        setExistingBusiness(biz as Business)
        // Load business data into form for editing
        const businessData = biz as Business
        setFormData({
          name: biz.name || '',
          username: biz.username || '',
          category: biz.category || '',
          location: biz.location || '',
          contact: biz.contact || '',
          description: biz.description || '',
          image: biz.image || '',
          openinghours: biz.openinghours || '',
          facebook: biz.facebook || '',
          instagram: biz.instagram || '',
          tiktok: biz.tiktok || '',
          twitter: biz.twitter || '',
          youtube: biz.youtube || '',
          linkedin: biz.linkedin || '',
          threads: biz.threads || '',
          whatsapp: biz.whatsapp || '',
          website: biz.website || '',
          googlemapurl: biz.googlemapurl || '',
          brandprimarycolor: biz.brandprimarycolor || '#ED1D33',
          brandsecondarycolor: biz.brandsecondarycolor || '#000000',
        })
      }
    } catch (err) {
      // No business found, which is fine
      console.log('No existing business found')
    } finally {
      setCheckingBusiness(false)
    }
  }

  const fetchCategories = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (!error && data) {
        setCategories(data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name || !formData.username || !formData.category) {
        alert('Please fill in all required fields (Name, Username, Category)')
        setLoading(false)
        return
      }

      if (!supabase) {
        alert('Database connection error')
        setLoading(false)
        return
      }

      const session = localStorage.getItem('userSession')
      if (!session) {
        alert('Please login first')
        router.push('/login')
        return
      }
      const userData = JSON.parse(session)

      // Check again if user already has a business
      const { data: userCheck } = await supabase
        .from('users')
        .select('business_id')
        .eq('id', userData.id)
        .single()

      if (userCheck && userCheck.business_id) {
        alert('You already have a business. Users can only create one business.')
        router.push('/my-businesses')
        return
      }

      const businessData = {
        name: formData.name,
        username: formData.username.toLowerCase().trim(),
        category: formData.category,
        location: formData.location || null,
        contact: formData.contact || null,
        description: formData.description || null,
        image: formData.image || null,
        openinghours: formData.openinghours || null,
        facebook: formData.facebook || null,
        instagram: formData.instagram || null,
        tiktok: formData.tiktok || null,
        twitter: formData.twitter || null,
        youtube: formData.youtube || null,
        linkedin: formData.linkedin || null,
        threads: formData.threads || null,
        whatsapp: formData.whatsapp || null,
        website: formData.website || null,
        googlemapurl: formData.googlemapurl || null,
        brandprimarycolor: formData.brandprimarycolor || null,
        brandsecondarycolor: formData.brandsecondarycolor || null,
        is_active: true
      }

      const { data: newBusiness, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          alert('Username already taken. Please choose a different username.')
        } else {
          alert('Error creating business: ' + error.message)
        }
        setLoading(false)
        return
      }

      // Update user's business_id to link them to the new business
      if (newBusiness) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ business_id: newBusiness.id })
          .eq('id', userData.id)

        if (updateError) {
          console.error('Error linking business to user:', updateError)
        }
      }

      // Refresh session to update user role to owner
      await refreshUserSession(userData.id)
      
      alert('Business created successfully! You are now the owner.')
      router.push('/dashboard')
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred while creating the business')
    } finally {
      setLoading(false)
    }
  }

  if (loading || checkingBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user already has a business, show message and redirect
  if (existingBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">One Business Per Account</h2>
          <p className="text-gray-600 mb-6">
            You already have a business associated with your account. Each user can only create one business.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/manage-business"
              className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Manage Your Business
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Create Your Business</h1>
          <p className="text-gray-600 text-sm mt-1">Fill in all the details to set up your business profile</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleAddBusiness} className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="Pizza Paradise"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="pizzaparadise"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for your business URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="Kathmandu, Nepal"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="/business-image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="Tell customers about your business..."
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              Additional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  name="openinghours"
                  value={formData.openinghours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="Mon-Fri 9AM-5PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Map URL</label>
                <input
                  type="url"
                  name="googlemapurl"
                  value={formData.googlemapurl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://maps.google.com/?q=Your+Business"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X URL</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://twitter.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://youtube.com/@yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://linkedin.com/company/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Threads URL</label>
                <input
                  type="url"
                  name="threads"
                  value={formData.threads}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  placeholder="https://threads.net/@yourpage"
                />
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Brand Colors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.brandprimarycolor}
                    onChange={handleChange}
                    name="brandprimarycolor"
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.brandprimarycolor}
                    onChange={handleChange}
                    name="brandprimarycolor"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="#ED1D33"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.brandsecondarycolor}
                    onChange={handleChange}
                    name="brandsecondarycolor"
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.brandsecondarycolor}
                    onChange={handleChange}
                    name="brandsecondarycolor"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Business...' : 'Create Business'}
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            * Required fields. You can only create one business per account.
          </p>
        </form>
      </div>
    </div>
  )
}
