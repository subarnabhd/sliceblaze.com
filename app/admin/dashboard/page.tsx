'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Business {
  id: number
  name: string
  username: string
  email: string
  phone: string
  description: string
  address: string
  city: string
  state: string
  pincode: string
  website: string
  is_active: boolean
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
        username: editingBusiness.username,
        email: editingBusiness.email,
        phone: editingBusiness.phone,
        description: editingBusiness.description,
        address: editingBusiness.address,
        city: editingBusiness.city,
        state: editingBusiness.state,
        pincode: editingBusiness.pincode,
        website: editingBusiness.website,
        is_active: editingBusiness.is_active,
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
            <div className="grid gap-4">
              {businesses.map((business) => (
                <div key={business.id} className="bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{business.name}</h3>
                      <p className="text-gray-400">@{business.username}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-300">Email: {business.email}</p>
                        <p className="text-gray-300">Phone: {business.phone}</p>
                        <p className="text-gray-300">City: {business.city}, {business.state}</p>
                        <p className="text-gray-300">Status: <span className={business.is_active ? 'text-green-500' : 'text-red-500'}>{business.is_active ? 'Active' : 'Inactive'}</span></p>
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
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editingBusiness.email}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingBusiness.phone}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, phone: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  value={editingBusiness.address}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={editingBusiness.city}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={editingBusiness.state}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={editingBusiness.pincode}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                <input
                  type="text"
                  value={editingBusiness.website}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, website: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="business-active"
                  checked={editingBusiness.is_active}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="business-active" className="text-sm font-medium text-gray-300">Active</label>
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
