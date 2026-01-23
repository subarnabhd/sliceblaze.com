'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, createBusiness } from '@/lib/supabase'

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

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  business_id: number | null
  is_active: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'businesses' | 'users'>('businesses')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [addingBusiness, setAddingBusiness] = useState(false)
  const [newBusinessData, setNewBusinessData] = useState<Partial<Business>>({})
  const [loading, setLoading] = useState(true)

  const fetchBusinesses = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching businesses:', error)
    } else {
      setBusinesses(data || [])
    }
  }

  const fetchUsers = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('username')

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data || [])
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchBusinesses(), fetchUsers()])
    setLoading(false)
  }, [])

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin')
      return
    }

    fetchData()
  }, [router, fetchData])

  const handleUpdateBusiness = async () => {
    if (!editingBusiness || !supabase) return

    const { error } = await supabase
      .from('businesses')
      .update({
        name: editingBusiness.name,
        location: editingBusiness.location,
        category: editingBusiness.category,
        image: editingBusiness.image,
        description: editingBusiness.description,
        contact: editingBusiness.contact,
        openingHours: editingBusiness.openingHours,
        facebook: editingBusiness.facebook,
        instagram: editingBusiness.instagram,
        tiktok: editingBusiness.tiktok,
        googleMapUrl: editingBusiness.googleMapUrl,
        direction: editingBusiness.direction,
        menuUrl: editingBusiness.menuUrl,
        wifiQrCode: editingBusiness.wifiQrCode,
        brandPrimaryColor: editingBusiness.brandPrimaryColor,
        brandSecondaryColor: editingBusiness.brandSecondaryColor,
      })
      .eq('id', editingBusiness.id)

    if (error) {
      alert('Error updating business: ' + error.message)
    } else {
      alert('Business updated successfully!')
      setEditingBusiness(null)
      fetchBusinesses()
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser || !supabase) return

    const { error } = await supabase
      .from('users')
      .update({
        username: editingUser.username,
        email: editingUser.email,
        full_name: editingUser.full_name,
        role: editingUser.role,
        business_id: editingUser.business_id,
        is_active: editingUser.is_active,
      })
      .eq('id', editingUser.id)

    if (error) {
      alert('Error updating user: ' + error.message)
    } else {
      alert('User updated successfully!')
      setEditingUser(null)
      fetchUsers()
    }
  }

  const handleCreateBusiness = async () => {
    if (!newBusinessData.name || !newBusinessData.username) {
      alert('Please fill in all required fields (Name, Username)')
      return
    }

    const businessToCreate = {
      name: newBusinessData.name,
      username: newBusinessData.username?.toLowerCase(),
      location: newBusinessData.location || '',
      category: newBusinessData.category || '',
      image: '',
      description: newBusinessData.description || '',
      contact: newBusinessData.contact || '',
      openingHours: newBusinessData.openingHours || '',
      facebook: newBusinessData.facebook || '',
      instagram: newBusinessData.instagram || '',
      tiktok: '',
      googleMapUrl: '',
      direction: '',
      menuUrl: newBusinessData.menuUrl || '',
      wifiQrCode: '',
      brandPrimaryColor: '#1e40af',
      brandSecondaryColor: '#3b82f6',
    }

    const result = await createBusiness(businessToCreate)

    if (result) {
      alert('Business created successfully!')
      setAddingBusiness(false)
      setNewBusinessData({})
      fetchBusinesses()
    } else {
      alert('Error creating business. Username may already exist.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            SliceBlaze <span className="text-red-500">Admin Dashboard</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('businesses')}
              className={`${
                activeTab === 'businesses'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Businesses ({businesses.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users ({users.length})
            </button>
          </nav>
        </div>

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setAddingBusiness(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add New Business
              </button>
            </div>
            <div className="grid gap-4">
              {businesses.map((business) => (
                <div key={business.id} className="bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{business.name}</h3>
                      <p className="text-gray-400">@{business.username}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-300">Category: {business.category}</p>
                        <p className="text-gray-300">Contact: {business.contact}</p>
                        <p className="text-gray-300">Location: {business.location}</p>
                        <p className="text-gray-300">Hours: {business.openingHours || 'N/A'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingBusiness(business)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{user.full_name}</h3>
                      <p className="text-gray-400">@{user.username}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-300">Email: {user.email}</p>
                        <p className="text-gray-300">Role: <span className="capitalize">{user.role}</span></p>
                        <p className="text-gray-300">Business ID: {user.business_id || 'N/A'}</p>
                        <p className="text-gray-300">Status: <span className={user.is_active ? 'text-green-500' : 'text-red-500'}>{user.is_active ? 'Active' : 'Inactive'}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Business Modal */}
      {addingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newBusinessData.name || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newBusinessData.username || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Enter unique username"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newBusinessData.category || ''}
                    onChange={(e) => setNewBusinessData({ ...newBusinessData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="e.g., Restaurant, Cafe, Retail"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact</label>
                  <input
                    type="text"
                    value={newBusinessData.contact || ''}
                    onChange={(e) => setNewBusinessData({ ...newBusinessData, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={newBusinessData.location || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newBusinessData.description || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Enter business description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={newBusinessData.openingHours || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={newBusinessData.facebook || ''}
                    onChange={(e) => setNewBusinessData({ ...newBusinessData, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="Facebook page URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={newBusinessData.instagram || ''}
                    onChange={(e) => setNewBusinessData({ ...newBusinessData, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Menu URL</label>
                <input
                  type="url"
                  value={newBusinessData.menuUrl || ''}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, menuUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Link to menu or website"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setAddingBusiness(false)
                  setNewBusinessData({})
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBusiness}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Business</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={editingBusiness.name}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={editingBusiness.username}
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded border border-gray-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingBusiness.category}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contact</label>
                  <input
                    type="text"
                    value={editingBusiness.contact}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={editingBusiness.location}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={editingBusiness.description}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={editingBusiness.openingHours}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={editingBusiness.facebook}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={editingBusiness.instagram}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Menu URL</label>
                <input
                  type="url"
                  value={editingBusiness.menuUrl}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, menuUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">TikTok</label>
                  <input
                    type="url"
                    value={editingBusiness.tiktok}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, tiktok: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="TikTok profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Google Map URL</label>
                  <input
                    type="url"
                    value={editingBusiness.googleMapUrl}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, googleMapUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="Google Maps link"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Direction</label>
                <input
                  type="text"
                  value={editingBusiness.direction}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, direction: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Detailed address or directions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Logo/Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const formData = new FormData()
                        formData.append('file', file)
                        
                        try {
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          })
                          const result = await response.json()
                          if (result.success) {
                            setEditingBusiness({ ...editingBusiness, image: result.url })
                          } else {
                            alert('Upload failed: ' + result.error)
                          }
                        } catch (error) {
                          alert('Upload error')
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    value={editingBusiness.image}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="/businessname.jpg or paste URL"
                  />
                  {editingBusiness.image && (
                    <div className="mt-2">
                      <img 
                        src={editingBusiness.image} 
                        alt="Business logo preview" 
                        className="h-20 w-20 object-cover rounded border border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">WiFi QR Code</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const formData = new FormData()
                        formData.append('file', file)
                        
                        try {
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          })
                          const result = await response.json()
                          if (result.success) {
                            setEditingBusiness({ ...editingBusiness, wifiQrCode: result.url })
                          } else {
                            alert('Upload failed: ' + result.error)
                          }
                        } catch (error) {
                          alert('Upload error')
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    value={editingBusiness.wifiQrCode}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, wifiQrCode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                    placeholder="/qrcodes/business-wifi.png or paste URL"
                  />
                  {editingBusiness.wifiQrCode && (
                    <div className="mt-2">
                      <img 
                        src={editingBusiness.wifiQrCode} 
                        alt="WiFi QR code preview" 
                        className="h-20 w-20 object-cover rounded border border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Brand Primary Color</label>
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
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Brand Secondary Color</label>
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
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingBusiness(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBusiness}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business ID</label>
                <input
                  type="number"
                  value={editingUser.business_id || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, business_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  placeholder="Leave empty for no business"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="user-active"
                  checked={editingUser.is_active}
                  onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="user-active" className="text-sm font-medium text-gray-300">Active</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
