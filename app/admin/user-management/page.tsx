'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'user'
  })

  useEffect(() => {
    checkAuth()
    fetchUsers()
  }, [])

  const checkAuth = () => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin')
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id)

      if (error) throw error
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'user'
    })
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setModalMode('edit')
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      password: '',
      role: user.role
    })
    setShowModal(true)
  }

  const openViewModal = (user: User) => {
    setModalMode('view')
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (modalMode === 'create') {
        const { error } = await supabase
          .from('users')
          .insert([{
            username: formData.username,
            email: formData.email,
            full_name: formData.full_name,
            password_hash: formData.password, // In production, this should be hashed
            role: formData.role
          }])

        if (error) throw error
        alert('User created successfully!')
      } else if (modalMode === 'edit' && selectedUser) {
        const updateData: any = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role
        }

        if (formData.password) {
          updateData.password_hash = formData.password
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', selectedUser.id)

        if (error) throw error
        alert('User updated successfully!')
      }

      setShowModal(false)
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error saving user. Please try again.')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterRole === 'all' || user.role === filterRole
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
          <p className="text-gray-600 text-sm mt-1">User Management</p>
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="text-lg">🏢</span>
            <span className="font-medium">Business Management</span>
          </Link>
          <Link
            href="/admin/user-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ED1D33] text-white transition"
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
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              Create New User
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users</option>
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
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.full_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openViewModal(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' && 'Create New User'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'view' && 'View User Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {modalMode === 'view' && selectedUser ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-gray-900">@{selectedUser.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-gray-900">{selectedUser.full_name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                      selectedUser.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                  <p className="mt-1 text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
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
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modalMode === 'create' ? '*' : '(leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    required={modalMode === 'create'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {modalMode === 'create' ? 'Create User' : 'Update User'}
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
