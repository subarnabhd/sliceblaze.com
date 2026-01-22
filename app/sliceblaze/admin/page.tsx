'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllUsers, getAllBusinessesAdmin, createUser, updateUser, deleteUser } from '@/lib/supabase'

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  business_id: number | null
  is_active: boolean
  created_at: string
  businesses: { name: string } | null
}

interface Business {
  id: number
  name: string
  username: string
  users: { username: string; email: string; full_name: string }[]
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'businesses'>('users')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    full_name: '',
    password_hash: '',
    role: 'user',
    business_id: null as number | null,
  })

  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const session = localStorage.getItem('session')
    if (!session) {
      router.push('/login')
      return
    }

    const user = JSON.parse(session)
    if (user.role !== 'admin') {
      router.push('/business')
      return
    }

    // Fetch data
    const fetchData = async () => {
      setLoading(true)
      const [usersData, businessesData] = await Promise.all([
        getAllUsers(),
        getAllBusinessesAdmin(),
      ])
      setUsers(usersData)
      setBusinesses(businessesData)
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.username || !newUser.email || !newUser.password_hash) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    const userData = {
      username: newUser.username,
      email: newUser.email,
      full_name: newUser.full_name || newUser.username,
      password_hash: newUser.password_hash,
      role: newUser.role,
      business_id: newUser.role === 'owner' ? newUser.business_id : null,
      is_active: true,
    }

    const result = await createUser(userData)

    if (result) {
      setMessage({ type: 'success', text: 'User created successfully' })
      setShowCreateModal(false)
      setNewUser({
        username: '',
        email: '',
        full_name: '',
        password_hash: '',
        role: 'user',
        business_id: null,
      })
      // Refresh users
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
    } else {
      setMessage({ type: 'error', text: 'Failed to create user' })
    }

    setTimeout(() => setMessage(null), 3000)
  }

  const handleToggleUserActive = async (userId: number, currentStatus: boolean) => {
    const result = await updateUser(userId, { is_active: !currentStatus })
    if (result) {
      setMessage({ type: 'success', text: `User ${!currentStatus ? 'activated' : 'deactivated'}` })
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(userId)
      if (result) {
        setMessage({ type: 'success', text: 'User deleted successfully' })
        const updatedUsers = await getAllUsers()
        setUsers(updatedUsers)
      } else {
        setMessage({ type: 'error', text: 'Failed to delete user' })
      }
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('session')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-red-600">SliceBlaze Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div
          className={`max-w-7xl mx-auto mt-4 px-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-semibold transition ${
              activeTab === 'users'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`py-3 px-4 font-semibold transition ${
              activeTab === 'businesses'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Businesses ({businesses.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                + Create User
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">Username</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Full Name</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Business</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-blue-600">{user.username}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.full_name}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'owner'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {user.businesses?.name || '—'}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-3 space-x-2">
                        <button
                          onClick={() => handleToggleUserActive(user.id, user.is_active)}
                          className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Businesses</h2>

            <div className="grid gap-4">
              {businesses.map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Username:</strong> {business.username}
                      </p>
                      {business.users && Array.isArray(business.users) && business.users[0] && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Owner:</strong> {business.users[0].full_name} ({business.users[0].email})
                        </p>
                      )}
                    </div>
                    <div className="space-x-2">
                      <a
                        href={`/business/${business.username}`}
                        className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New User</h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password_hash}
                  onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="user">User</option>
                  <option value="owner">Business Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {newUser.role === 'owner' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business ID (optional)
                  </label>
                  <input
                    type="number"
                    value={newUser.business_id || ''}
                    onChange={(e) => setNewUser({ ...newUser, business_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
