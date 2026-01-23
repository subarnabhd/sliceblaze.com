'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Business {
  id: number
  name: string
  username: string
  location: string
  category: string
  image: string
  description: string
  contact: string
  openingHours: string
  facebook: string
  instagram: string
  tiktok: string
  is_active: boolean
}

interface Category {
  id: number
  name: string
  is_active: boolean
}

interface User {
  id: number
  username: string
  email: string
  full_name: string
  business_id: number | null
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'business'>('profile')
  const [creatingBusiness, setCreatingBusiness] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '',
    username: '',
    location: '',
    category: '',
    image: '',
    description: '',
    contact: '',
    openingHours: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    is_active: true
  })

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(session)
    setUser(userData)
    if (userData.business_id) {
      fetchBusiness(userData.business_id)
      setActiveTab('business')
    } else {
      setLoading(false)
    }
    fetchCategories()
  }, [router])

  const fetchBusiness = async (businessId: number) => {
    if (!supabase || !businessId) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (error) {
      console.error('Error fetching business:', error)
    } else {
      setBusiness(data)
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (!error && data) {
      setCategories(data)
    }
  }

  const handleUpdateBusiness = async () => {
    if (!business || !supabase) return

    const { error } = await supabase
      .from('businesses')
      .update({
        name: business.name,
        location: business.location,
        category: business.category,
        image: business.image,
        description: business.description,
        contact: business.contact,
        openingHours: business.openingHours,
        facebook: business.facebook,
        instagram: business.instagram,
        tiktok: business.tiktok,
      })
      .eq('id', business.id)

    if (error) {
      alert('Error updating business: ' + error.message)
    } else {
      alert('Business updated successfully!')
    }
  }

  const handleCreateBusiness = async () => {
    if (!newBusiness.name || !newBusiness.username || !supabase || !user) {
      alert('Please fill in all required fields (Name and Username)')
      return
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert([{
        ...newBusiness,
        password_hash: 'default123'
      }])
      .select()

    if (error) {
      alert('Error creating business: ' + error.message)
      return
    }

    if (data && data[0]) {
      const { error: userError } = await supabase
        .from('users')
        .update({ business_id: data[0].id })
        .eq('id', user.id)

      if (userError) {
        alert('Business created but failed to assign: ' + userError.message)
      } else {
        alert('Business created successfully!')
        setBusiness(data[0])
        setCreatingBusiness(false)
        setActiveTab('business')
        
        const updatedUser = { ...user, business_id: data[0].id }
        setUser(updatedUser)
        localStorage.setItem('userSession', JSON.stringify(updatedUser))
      }
    }
  }

  const handleDeleteBusiness = async () => {
    if (!business || !supabase || !user) return

    if (!confirm('Are you sure you want to delete your business? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id)

    if (error) {
      alert('Error deleting business: ' + error.message)
    } else {
      const { error: userError } = await supabase
        .from('users')
        .update({ business_id: null })
        .eq('id', user.id)

      if (!userError) {
        alert('Business deleted successfully!')
        setBusiness(null)
        const updatedUser = { ...user, business_id: null }
        setUser(updatedUser)
        localStorage.setItem('userSession', JSON.stringify(updatedUser))
        setActiveTab('profile')
      }
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || !supabase) return

    const { error } = await supabase
      .from('users')
      .update({
        full_name: user.full_name,
        email: user.email
      })
      .eq('id', user.id)

    if (error) {
      alert('Error updating profile: ' + error.message)
    } else {
      alert('Profile updated successfully!')
      setEditingProfile(false)
      localStorage.setItem('userSession', JSON.stringify(user))
    }
  }

  const handleFileUpload = async (file: File, field: 'image' | 'wifiQrCode') => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (creatingBusiness) {
          setNewBusiness({ ...newBusiness, [field]: data.url })
        } else if (business) {
          setBusiness({ ...business, [field]: data.url })
        }
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome, {user.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="px-8 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'profile'
                  ? 'border-[#ED1D33] text-[#ED1D33]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                activeTab === 'business'
                  ? 'border-[#ED1D33] text-[#ED1D33]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Business
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.full_name}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded border border-gray-300 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingProfile(false)
                      const session = localStorage.getItem('userSession')
                      if (session) setUser(JSON.parse(session))
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{user.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-lg font-medium text-gray-900">@{user.username}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'business' && !business && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Business Yet</h2>
            <p className="text-gray-600 mb-6">Create your business profile to get started</p>
            <button
              onClick={() => setCreatingBusiness(true)}
              className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Create My Business
            </button>
          </div>
        )}

        {activeTab === 'business' && business && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Business</h2>
              <button
                onClick={handleDeleteBusiness}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Business
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <select
                  multiple
                  value={business.category?.split(', ') || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                    setBusiness({ ...business, category: selectedOptions.join(', ') })
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  size={5}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={business.contact}
                    onChange={(e) => setBusiness({ ...business, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={business.location}
                    onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={business.description}
                  onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={business.openingHours}
                  onChange={(e) => setBusiness({ ...business, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={business.facebook}
                    onChange={(e) => setBusiness({ ...business, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Facebook URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={business.instagram}
                    onChange={(e) => setBusiness({ ...business, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Instagram URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={business.tiktok}
                    onChange={(e) => setBusiness({ ...business, tiktok: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="TikTok URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'image')
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300"
                />
                {business.image && (
                  <img src={business.image} alt="Logo" className="mt-2 h-20 object-contain" />
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleUpdateBusiness}
                  className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Business Modal */}
      {creatingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusiness.name || ''}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusiness.username || ''}
                  onChange={(e) => setNewBusiness({ ...newBusiness, username: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Choose a unique username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <select
                  multiple
                  value={newBusiness.category?.split(', ') || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                    setNewBusiness({ ...newBusiness, category: selectedOptions.join(', ') })
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  size={5}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={newBusiness.contact || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newBusiness.location || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={newBusiness.openingHours || ''}
                  onChange={(e) => setNewBusiness({ ...newBusiness, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={newBusiness.facebook || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Facebook URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={newBusiness.instagram || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Instagram URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={newBusiness.tiktok || ''}
                    onChange={(e) => setNewBusiness({ ...newBusiness, tiktok: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="TikTok URL"
                  />
                </div>  
                </div>  
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newBusiness.description || ''}
                  onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'image')
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300"
                />
                {newBusiness.image && (
                  <img src={newBusiness.image} alt="Logo preview" className="mt-2 h-20 object-contain" />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setCreatingBusiness(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBusiness}
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
                >
                  Create Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
