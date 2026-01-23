'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  googleMapUrl: string
  direction: string
  menuUrl: string
  wifiQrCode: string
  brandPrimaryColor: string
  brandSecondaryColor: string
}

interface SessionUser {
  userId: number
  businessId: number | null
  username: string
  email: string
  role: string
  fullName: string
}

export default function MyBusinessesPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('session')
    if (!session) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(session) as SessionUser
    setUser(userData)
    fetchUserBusinesses()
  }, [router])

  const fetchUserBusinesses = async () => {
    setLoading(true)
    try {
      if (!supabase) return

      // For now, fetch all businesses (in production, filter by owner)
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching businesses:', error)
      } else {
        setBusinesses(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('session')
    router.push('/login')
  }

  const handleAddBusiness = () => {
    // Navigate to add business page
    router.push('/user/add-business')
  }

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business)
  }

  const handleUpdateBusiness = async () => {
    if (!editingBusiness || !supabase) return

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: editingBusiness.name,
          location: editingBusiness.location,
          category: editingBusiness.category,
          description: editingBusiness.description,
          contact: editingBusiness.contact,
          openingHours: editingBusiness.openingHours,
          facebook: editingBusiness.facebook,
          instagram: editingBusiness.instagram,
          tiktok: editingBusiness.tiktok,
          googleMapUrl: editingBusiness.googleMapUrl,
          direction: editingBusiness.direction,
          menuUrl: editingBusiness.menuUrl,
          brandPrimaryColor: editingBusiness.brandPrimaryColor,
          brandSecondaryColor: editingBusiness.brandSecondaryColor,
        })
        .eq('id', editingBusiness.id)

      if (error) {
        alert('Error updating business: ' + error.message)
      } else {
        alert('Business updated successfully!')
        setEditingBusiness(null)
        fetchUserBusinesses()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome, {user?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Business Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddBusiness}
            className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Business
          </button>
        </div>

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No businesses yet</p>
            <button
              onClick={handleAddBusiness}
              className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Create Your First Business
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#ED1D33] overflow-hidden"
              >
                <div className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {business.image && (
                        <Image
                          src={business.image}
                          alt={business.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                        <p className="text-gray-600">@{business.username}</p>
                        <p className="text-sm text-gray-500 mt-1">{business.category} • {business.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{business.description}</p>
                  </div>
                  <button
                    onClick={() => handleEditBusiness(business)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Business Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={editingBusiness.name}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingBusiness.category}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingBusiness.location}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingBusiness.description}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={editingBusiness.contact}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={editingBusiness.openingHours}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., 9 AM - 5 PM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={editingBusiness.facebook}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={editingBusiness.instagram}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingBusiness.brandPrimaryColor}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, brandPrimaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingBusiness.brandPrimaryColor}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, brandPrimaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingBusiness.brandSecondaryColor}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, brandSecondaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingBusiness.brandSecondaryColor}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, brandSecondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingBusiness(null)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBusiness}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
