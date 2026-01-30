'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from "next/image";
import CloudinaryUpload from '@/components/CloudinaryUpload'

interface Business {
  id: number
  name: string
  username: string
  category: string
  location: string
  contact: string
  is_active: boolean
  created_at: string
  description?: string
  website?: string
  business_logo?: string
  businesscover?: string
  businessphotos?: string[]
  openinghours?: string
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
  youtube?: string
  linkedin?: string
  threads?: string
  google_map_url?: string
  brand_primary_color?: string
  brand_secondary_color?: string
  image?: string
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
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    location: '',
    contact: '',
    is_active: true,
    description: '',
    website: '',
    business_logo: '',
    businesscover: '',
    businessphotos: [] as string[],
    openinghours: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    whatsapp: '',
    youtube: '',
    linkedin: '',
    threads: '',
    google_map_url: '',
    brand_primary_color: '#ED1D33',
    brand_secondary_color: '#000000'
  })

  useEffect(() => {
    checkAuth()
    fetchBusinesses()
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      location: '',
      contact: '',
      is_active: true,
      description: '',
      website: '',
      business_logo: '',
      businesscover: '',
      businessphotos: [],
      openinghours: '',
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: '',
      whatsapp: '',
      youtube: '',
      linkedin: '',
      threads: '',
      google_map_url: '',
      brand_primary_color: '#ED1D33',
      brand_secondary_color: '#000000'
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
      location: business.location,
      contact: business.contact,
      is_active: business.is_active,
      description: business.description || '',
      website: business.website || '',
      business_logo: business.business_logo || '',
      businesscover: business.businesscover || '',
      businessphotos: business.businessphotos || [],
      openinghours: business.openinghours || '',
      facebook: business.facebook || '',
      instagram: business.instagram || '',
      twitter: business.twitter || '',
      tiktok: business.tiktok || '',
      whatsapp: business.whatsapp || '',
      youtube: business.youtube || '',
      linkedin: business.linkedin || '',
      threads: business.threads || '',
      google_map_url: business.google_map_url || '',
      brand_primary_color: business.brand_primary_color || '#ED1D33',
      brand_secondary_color: business.brand_secondary_color || '#000000'
    })
    setShowModal(true)
  }

  const openViewModal = (business: Business) => {
    setModalMode('view')
    setSelectedBusiness(business)
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
            location: formData.location,
            contact: formData.contact,
            is_active: formData.is_active,
            description: formData.description || null,
            website: formData.website || null,
            business_logo: formData.business_logo || null,
            businesscover: formData.businesscover || null,
            businessphotos: formData.businessphotos || null,
            openinghours: formData.openinghours || null,
            facebook: formData.facebook || null,
            instagram: formData.instagram || null,
            twitter: formData.twitter || null,
            tiktok: formData.tiktok || null,
            whatsapp: formData.whatsapp || null,
            youtube: formData.youtube || null,
            linkedin: formData.linkedin || null,
            threads: formData.threads || null,
            google_map_url: formData.google_map_url || null,
            brand_primary_color: formData.brand_primary_color || null,
            brand_secondary_color: formData.brand_secondary_color || null
          }])

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message || 'Failed to create business')
        }
        alert('Business created successfully!')
      } else if (modalMode === 'edit' && selectedBusiness) {
        const { data, error } = await supabase
          .from('businesses')
          .update({
            name: formData.name,
            username: formData.username,
            category: formData.category,
            location: formData.location,
            contact: formData.contact,
            is_active: formData.is_active,
            description: formData.description || null,
            website: formData.website || null,
            business_logo: formData.business_logo || null,
            businesscover: formData.businesscover || null,
            businessphotos: formData.businessphotos || null,
            openinghours: formData.openinghours || null,
            facebook: formData.facebook || null,
            instagram: formData.instagram || null,
            twitter: formData.twitter || null,
            tiktok: formData.tiktok || null,
            whatsapp: formData.whatsapp || null,
            youtube: formData.youtube || null,
            linkedin: formData.linkedin || null,
            threads: formData.threads || null,
            google_map_url: formData.google_map_url || null,
            brand_primary_color: formData.brand_primary_color || null,
            brand_secondary_color: formData.brand_secondary_color || null
          })
          .eq('id', selectedBusiness.id)

        console.log('Update response:', { data, error, selectedBusinessId: selectedBusiness.id })
        
        if (error) {
          console.error('Supabase error:', error)
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(error.message || error.details || 'Failed to update business')
        }
        alert('Business updated successfully!')
        fetchBusinesses() // Refresh the list
      }

      setShowModal(false)
      fetchBusinesses()
    } catch (error) {
      console.error('Error saving business:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      alert(`Error saving business: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
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
                      <div className="text-sm text-gray-500">{business.contact}</div>
                      <div className="text-sm text-gray-400">{business.location}</div>
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
                    <p className="mt-1 text-gray-900">{selectedBusiness.contact}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-gray-900">{selectedBusiness.location}</p>
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
                  {selectedBusiness.openinghours && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                      <p className="mt-1 text-gray-900">{selectedBusiness.openinghours}</p>
                    </div>
                  )}
                  {(selectedBusiness.facebook || selectedBusiness.instagram || selectedBusiness.twitter) && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                      <div className="space-y-1">
                        {selectedBusiness.facebook && (
                          <p className="text-gray-900">
                            <span className="font-medium">Facebook:</span>{' '}
                            <a href={selectedBusiness.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.facebook}
                            </a>
                          </p>
                        )}
                        {selectedBusiness.instagram && (
                          <p className="text-gray-900">
                            <span className="font-medium">Instagram:</span>{' '}
                            <a href={selectedBusiness.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.instagram}
                            </a>
                          </p>
                        )}
                        {selectedBusiness.twitter && (
                          <p className="text-gray-900">
                            <span className="font-medium">Twitter:</span>{' '}
                            <a href={selectedBusiness.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedBusiness.twitter}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {(selectedBusiness.brand_primary_color || selectedBusiness.brand_secondary_color) && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                      <div className="flex gap-4">
                        {selectedBusiness.brand_primary_color && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded border border-gray-300" 
                              style={{ backgroundColor: selectedBusiness.brand_primary_color }}
                            ></div>
                            <div>
                              <p className="text-xs text-gray-500">Primary</p>
                              <p className="text-sm font-medium text-gray-900">{selectedBusiness.brand_primary_color}</p>
                            </div>
                          </div>
                        )}
                        {selectedBusiness.brand_secondary_color && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded border border-gray-300" 
                              style={{ backgroundColor: selectedBusiness.brand_secondary_color }}
                            ></div>
                            <div>
                              <p className="text-xs text-gray-500">Secondary</p>
                              <p className="text-sm font-medium text-gray-900">{selectedBusiness.brand_secondary_color}</p>
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
                      value={formData.name || ''}
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
                      value={formData.username || ''}
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
                      value={formData.category || ''}
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
                      value={formData.contact || ''}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      required
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                      value={formData.description || ''}
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
                      value={formData.website || ''}
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
                      value={formData.openinghours || ''}
                      onChange={(e) => setFormData({ ...formData, openinghours: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      placeholder="Mon-Fri 9AM-5PM"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo *
                    </label>
                    <CloudinaryUpload
                      currentImage={formData.business_logo}
                      onUploadComplete={(url) => setFormData({ ...formData, business_logo: url })}
                      folder="businesses/logos"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <CloudinaryUpload
                      currentImage={formData.businesscover}
                      onUploadComplete={(url) => setFormData({ ...formData, businesscover: url })}
                      folder="businesses/covers"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Photos (Max 10)
                    </label>
                    <div className="space-y-2">
                      {formData.businessphotos.map((photo, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Image src={photo} alt={`Photo ${index + 1}`} width={64} height={64} className="w-16 h-16 rounded object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newPhotos = formData.businessphotos.filter((_, i) => i !== index)
                              setFormData({ ...formData, businessphotos: newPhotos })
                            }}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {formData.businessphotos.length < 10 && (
                        <CloudinaryUpload
                          currentImage=""
                          onUploadComplete={(url) => {
                            if (formData.businessphotos.length < 10) {
                              setFormData({ ...formData, businessphotos: [...formData.businessphotos, url] })
                            }
                          }}
                          folder="businesses/photos"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formData.businessphotos.length}/10 photos uploaded</p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Links
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="url"
                        value={formData.facebook || ''}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Facebook URL"
                      />
                      <input
                        type="url"
                        value={formData.instagram || ''}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Instagram URL"
                      />
                      <input
                        type="url"
                        value={formData.twitter || ''}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Twitter URL"
                      />
                      <input
                        type="url"
                        value={formData.tiktok || ''}
                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="TikTok URL"
                      />
                      <input
                        type="url"
                        value={formData.youtube || ''}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="YouTube URL"
                      />
                      <input
                        type="url"
                        value={formData.linkedin || ''}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="LinkedIn URL"
                      />
                      <input
                        type="url"
                        value={formData.threads || ''}
                        onChange={(e) => setFormData({ ...formData, threads: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Threads URL"
                      />
                      <input
                        type="tel"
                        value={formData.whatsapp || ''}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="WhatsApp Number (e.g., 9851234567)"
                      />
                      <input
                        type="url"
                        value={formData.google_map_url || ''}
                        onChange={(e) => setFormData({ ...formData, google_map_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="Google Maps URL"
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
                        value={formData.brand_primary_color || '#ED1D33'}
                        onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brand_primary_color || '#ED1D33'}
                        onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
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
                        value={formData.brand_secondary_color || '#000000'}
                        onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brand_secondary_color || '#000000'}
                        onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                        placeholder="#000000"
                      />
                    </div>
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
