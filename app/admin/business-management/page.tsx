'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import CloudinaryUpload from '@/components/CloudinaryUpload'

interface Business {
  id: number
  name: string
  username: string
  category: string
  address: string
  phone: string
  email: string
  is_active: boolean
  created_at: string
  user_id?: number
  description?: string
  website?: string
  logo_url?: string
  cover_image_url?: string
  opening_hours?: string
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  primary_color?: string
  secondary_color?: string
}

interface User {
  id: number
  username: string
  email: string
}

export default function BusinessManagement() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'assign'>('create')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    is_active: true,
    user_id: 0,
    description: '',
    website: '',
    logo_url: '',
    cover_image_url: '',
    opening_hours: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    primary_color: '#ED1D33',
    secondary_color: '#000000'
  })

  useEffect(() => {
    checkAuth()
    fetchBusinesses()
    fetchUsers()
  }, [])

  const checkAuth = () => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin')
    }
  }

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email')
        .order('username', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleBusinessStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchBusinesses()
    } catch (error) {
      console.error('Error updating business:', error)
    }
  }

  const deleteBusiness = async (id: number) => {
    if (!confirm('Are you sure you want to delete this business?')) return

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchBusinesses()
    } catch (error) {
      console.error('Error deleting business:', error)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      name: '',
      username: '',
      category: '',
      address: '',
      phone: '',
      email: '',
      is_active: true,
      user_id: 0,
      description: '',
      website: '',
      logo_url: '',
      cover_image_url: '',
      opening_hours: '',
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      primary_color: '#ED1D33',
      secondary_color: '#000000'
    })
    setShowModal(true)
  }

  const openEditModal = (business: Business) => {
    setModalMode('edit')
    setSelectedBusiness(business)
    setFormData({
      name: business.name,
      username: business.username,
      category: business.category,
      address: business.address,
      phone: business.phone,
      email: business.email,
      is_active: business.is_active,
      user_id: business.user_id || 0,
      description: business.description || '',
      website: business.website || '',
      logo_url: business.logo_url || '',
      cover_image_url: business.cover_image_url || '',
      opening_hours: business.opening_hours || '',
      facebook_url: business.facebook_url || '',
      instagram_url: business.instagram_url || '',
      twitter_url: business.twitter_url || '',
      primary_color: business.primary_color || '#ED1D33',
      secondary_color: business.secondary_color || '#000000'
    })
    setShowModal(true)
  }

  const openViewModal = (business: Business) => {
    setModalMode('view')
    setSelectedBusiness(business)
    setShowModal(true)
  }

  const openAssignModal = (business: Business) => {
    setModalMode('assign')
    setSelectedBusiness(business)
    setFormData({
      ...formData,
      user_id: business.user_id || 0
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (modalMode === 'create') {
        const { error } = await supabase
          .from('businesses')
          .insert([{
            name: formData.name,
            username: formData.username,
            category: formData.category,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            is_active: formData.is_active,
            user_id: formData.user_id || null,
            description: formData.description || null,
            website: formData.website || null,
            logo_url: formData.logo_url || null,
            cover_image_url: formData.cover_image_url || null,
            opening_hours: formData.opening_hours || null,
            facebook_url: formData.facebook_url || null,
            instagram_url: formData.instagram_url || null,
            twitter_url: formData.twitter_url || null,
            primary_color: formData.primary_color || null,
            secondary_color: formData.secondary_color || null
          }])

        if (error) throw error
        alert('Business created successfully!')
      } else if (modalMode === 'edit' && selectedBusiness) {
        const { error } = await supabase
          .from('businesses')
          .update({
            name: formData.name,
            username: formData.username,
            category: formData.category,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            is_active: formData.is_active,
            user_id: formData.user_id || null,
            description: formData.description || null,
            website: formData.website || null,
            logo_url: formData.logo_url || null,
            cover_image_url: formData.cover_image_url || null,
            opening_hours: formData.opening_hours || null,
            facebook_url: formData.facebook_url || null,
            instagram_url: formData.instagram_url || null,
            twitter_url: formData.twitter_url || null,
            primary_color: formData.primary_color || null,
            secondary_color: formData.secondary_color || null
          })
          .eq('id', selectedBusiness.id)

        if (error) throw error
        alert('Business updated successfully!')
      } else if (modalMode === 'assign' && selectedBusiness) {
        const { error } = await supabase
          .from('businesses')
          .update({ user_id: formData.user_id || null })
          .eq('id', selectedBusiness.id)

        if (error) throw error
        alert('Business assigned successfully!')
      }

      setShowModal(false)
      fetchBusinesses()
    } catch (error) {
      console.error('Error saving business:', error)
      alert('Error saving business. Please try again.')
    }
  }

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && business.is_active) ||
                         (filterActive === 'inactive' && !business.is_active)
    return matchesSearch && matchesFilter
  })

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#ED1D33]">Admin Panel</h2>
          <p className="text-gray-600 text-sm mt-1">Business Management</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/admin/overview"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="text-lg">📊</span>
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/admin/business-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ED1D33] text-white transition"
          >
            <span className="text-lg">🏢</span>
            <span className="font-medium">Business Management</span>
          </Link>
          <Link
            href="/admin/user-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="text-lg">👥</span>
            <span className="font-medium">User Management</span>
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="text-lg">🍕</span>
            <span className="font-medium">Menu Management</span>
          </Link>
          <Link
            href="/admin/wifi"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="text-lg">📶</span>
            <span className="font-medium">WiFi Management</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-y-auto">
        <div className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Business Management</h2>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              Create New Business
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
            />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
            >
              <option value="all">All Businesses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ED1D33] border-r-transparent"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBusinesses.map((business) => (
                  <tr key={business.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{business.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">@{business.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{business.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{business.phone}</div>
                      <div className="text-sm text-gray-400">{business.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        business.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openViewModal(business)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(business)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openAssignModal(business)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => toggleBusinessStatus(business.id, business.is_active)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        {business.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteBusiness(business.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No businesses found
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' && 'Create New Business'}
                {modalMode === 'edit' && 'Edit Business'}
                {modalMode === 'view' && 'View Business Details'}
                {modalMode === 'assign' && 'Assign Business to User'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {modalMode === 'view' && selectedBusiness ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-gray-900">@{selectedBusiness.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                        selectedBusiness.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBusiness.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.address}</p>
                  </div>
                  {selectedBusiness.description && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-gray-900">{selectedBusiness.description}</p>
                    </div>
                  )}
                  {selectedBusiness.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <p className="mt-1 text-gray-900">
                        <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedBusiness.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedBusiness.opening_hours && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                      <p className="mt-1 text-gray-900">{selectedBusiness.opening_hours}</p>
                    </div>
                  )}
                  {selectedBusiness.logo_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                      <p className="mt-1 text-gray-900 break-all">{selectedBusiness.logo_url}</p>
                    </div>
                  )}
                  {selectedBusiness.cover_image_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                      <p className="mt-1 text-gray-900 break-all">{selectedBusiness.cover_image_url}</p>
                    </div>
                  )}
                  {(selectedBusiness.facebook_url || selectedBusiness.instagram_url || selectedBusiness.twitter_url) && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                      <div className="space-y-1">
                        {selectedBusiness.facebook_url && (
                          <p className="text-gray-900">
                            <span className="font-medium">Facebook:</span>{' '}
                            <a href={selectedBusiness.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.facebook_url}
                            </a>
                          </p>
                        )}
                        {selectedBusiness.instagram_url && (
                          <p className="text-gray-900">
                            <span className="font-medium">Instagram:</span>{' '}
                            <a href={selectedBusiness.instagram_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.instagram_url}
                            </a>
                          </p>
                        )}
                        {selectedBusiness.twitter_url && (
                          <p className="text-gray-900">
                            <span className="font-medium">Twitter:</span>{' '}
                            <a href={selectedBusiness.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.twitter_url}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {(selectedBusiness.primary_color || selectedBusiness.secondary_color) && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                      <div className="flex gap-4">
                        {selectedBusiness.primary_color && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded border border-gray-300" 
                              style={{ backgroundColor: selectedBusiness.primary_color }}
                            ></div>
                            <div>
                              <p className="text-xs text-gray-500">Primary</p>
                              <p className="text-sm font-medium text-gray-900">{selectedBusiness.primary_color}</p>
                            </div>
                          </div>
                        )}
                        {selectedBusiness.secondary_color && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded border border-gray-300" 
                              style={{ backgroundColor: selectedBusiness.secondary_color }}
                            ></div>
                            <div>
                              <p className="text-xs text-gray-500">Secondary</p>
                              <p className="text-sm font-medium text-gray-900">{selectedBusiness.secondary_color}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="mt-1 text-gray-900">{new Date(selectedBusiness.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            ) : modalMode === 'assign' && selectedBusiness ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to User
                  </label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  >
                    <option value={0}>Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Assign Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="Pizza Paradise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="pizzaparadise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Bar">Bar</option>
                      <option value="Fast Food">Fast Food</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Food Truck">Food Truck</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Retail">Retail</option>
                      <option value="Salon">Salon</option>
                      <option value="Gym">Gym</option>
                      <option value="Services">Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="contact@pizzaparadise.com"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="123 Main St, City, Country"
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="Brief description of your business..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={formData.opening_hours}
                      onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="Mon-Fri 9AM-5PM"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Logo
                    </label>
                    <CloudinaryUpload
                      onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                      currentImage={formData.logo_url}
                      folder="businesses/logos"
                      maxSize={5}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                    </label>
                    <CloudinaryUpload
                      onUploadComplete={(url) => setFormData({ ...formData, cover_image_url: url })}
                      currentImage={formData.cover_image_url}
                      folder="businesses/covers"
                      maxSize={5}
                    />
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Links
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="url"
                        value={formData.facebook_url}
                        onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Facebook URL"
                      />
                      <input
                        type="url"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Instagram URL"
                      />
                      <input
                        type="url"
                        value={formData.twitter_url}
                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Twitter URL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="#ED1D33"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to User
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    >
                      <option value={0}>Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {modalMode === 'create' ? 'Create Business' : 'Update Business'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
