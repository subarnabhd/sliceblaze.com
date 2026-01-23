'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, createBusiness } from '@/lib/supabase'
import Image from 'next/image'

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

interface Category {
  id: number
  name: string
  is_active: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'businesses' | 'users' | 'categories'>('businesses')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [addingBusiness, setAddingBusiness] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newBusinessData, setNewBusinessData] = useState<Partial<Business>>({})
  const [newCategoryData, setNewCategoryData] = useState({ name: '', is_active: true })
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

  const fetchCategories = async () => {
    if (!supabase) return
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchBusinesses(), fetchUsers(), fetchCategories()])
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
      image: newBusinessData.image || '',
      description: newBusinessData.description || '',
      contact: newBusinessData.contact || '',
      openingHours: newBusinessData.openingHours || '',
      facebook: newBusinessData.facebook || '',
      instagram: newBusinessData.instagram || '',
      tiktok: newBusinessData.tiktok || '',
      googleMapUrl: newBusinessData.googleMapUrl || '',
      direction: newBusinessData.direction || '',
      menuUrl: newBusinessData.menuUrl || '',
      wifiQrCode: newBusinessData.wifiQrCode || '',
      brandPrimaryColor: newBusinessData.brandPrimaryColor || '#1e40af',
      brandSecondaryColor: newBusinessData.brandSecondaryColor || '#3b82f6',
      is_active: newBusinessData.is_active !== false,
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

  const handleDeleteBusiness = async (businessId: number) => {
    if (!confirm('Are you sure you want to delete this business?')) return
    if (!supabase) return

    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId)

    if (error) {
      alert('Error deleting business: ' + error.message)
    } else {
      alert('Business deleted successfully!')
      fetchBusinesses()
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryData.name.trim()) {
      alert('Please enter a category name')
      return
    }

    if (!supabase) return

    const { error } = await supabase
      .from('categories')
      .insert([
        {
          name: newCategoryData.name.trim(),
          is_active: newCategoryData.is_active,
        },
      ])

    if (error) {
      alert('Error creating category: ' + error.message)
    } else {
      alert('Category created successfully!')
      setAddingCategory(false)
      setNewCategoryData({ name: '', is_active: true })
      fetchCategories()
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !supabase) return

    const { error } = await supabase
      .from('categories')
      .update({
        name: editingCategory.name,
        is_active: editingCategory.is_active,
      })
      .eq('id', editingCategory.id)

    if (error) {
      alert('Error updating category: ' + error.message)
    } else {
      alert('Category updated successfully!')
      setEditingCategory(null)
      fetchCategories()
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    if (!supabase) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      alert('Error deleting category: ' + error.message)
    } else {
      alert('Category deleted successfully!')
      fetchCategories()
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6 border-b border-gray-200">
     
            <Image
              src="/sliceblazelogo.svg"
              alt="SliceBlaze"
              width={120}
              height={120}
            />

        </div>
        <nav className="mt-8 space-y-2 px-4">
          <button
            onClick={() => setActiveTab("businesses")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "businesses"
                ? "bg-[#ED1D33] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🏢</span> Businesses
            </span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "users"
                ? "bg-[#ED1D33] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">👥</span> Users
            </span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              activeTab === "categories"
                ? "bg-[#ED1D33] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🏷️</span> Categories
            </span>
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === "businesses"
                  ? "Businesses"
                  : activeTab === "users"
                    ? "Users"
                    : "Categories"}{" "}
                Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {activeTab === "businesses"
                  ? "Manage all registered businesses"
                  : activeTab === "users"
                    ? "Manage system users and roles"
                    : "Manage business categories"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Businesses
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {businesses.length}
                  </p>
                </div>
                <div className="text-4xl">🏢</div>
              </div>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {users.length}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
            <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {users.filter((u) => u.is_active).length}
                  </p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {categories.length}
                  </p>
                </div>
                <div className="text-4xl">🏷️</div>
                <p className="text-orange-600 text-sm font-medium">Owners</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  {users.filter((u) => u.role === "owner").length}
                </p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>
        </div>

        {/* Businesses Tab */}
        {activeTab === "businesses" && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setAddingBusiness(true)}
                className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-md"
              >
                <span className="text-xl">+</span> Add New Business
              </button>
            </div>
            {businesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No businesses yet. Create one to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#ED1D33] overflow-hidden"
                  >
                    <div className="p-6 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {business.name}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            @{business.username}
                          </span>
                          {business.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          {business.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="font-medium text-gray-900">
                              {business.category || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">
                              {business.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Contact</p>
                            <p className="font-medium text-gray-900">
                              {business.contact}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Hours</p>
                            <p className="font-medium text-gray-900">
                              {business.openingHours || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => setEditingBusiness(business)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBusiness(business.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {users.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">No users yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-purple-500 overflow-hidden"
                  >
                    <div className="p-6 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {user.full_name}
                          </h3>
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "owner"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                          {user.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Username</p>
                            <p className="font-medium text-gray-900">
                              @{user.username}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Assigned Business</p>
                            <p className="font-medium text-gray-900">
                              {user.business_id 
                                ? businesses.find(b => b.id === user.business_id)?.name || `ID: ${user.business_id}`
                                : "None"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Role</p>
                            <p className="font-medium text-gray-900 capitalize">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingUser(user)}
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
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setAddingCategory(true)}
                className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-md"
              >
                <span className="text-xl">+</span> Add New Category
              </button>
            </div>
            {categories.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No categories yet. Create one to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition border-l-4 border-orange-500 overflow-hidden"
                  >
                    <div className="p-6 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {category.name}
                          </h3>
                          {category.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-3">
                          Created:{" "}
                          {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Category Modal */}
      {addingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData({
                      ...newCategoryData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., Restaurant, Cafe, Retail"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-category-active"
                  checked={newCategoryData.is_active}
                  onChange={(e) =>
                    setNewCategoryData({
                      ...newCategoryData,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="new-category-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setAddingCategory(false);
                  setNewCategoryData({ name: "", is_active: true });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-category-active"
                  checked={editingCategory.is_active}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="edit-category-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Business Modal */}
      {addingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Business
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusinessData.name || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusinessData.username || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Enter unique username"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <select
                    multiple
                    value={newBusinessData.category?.split(', ') || []}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setNewBusinessData({
                        ...newBusinessData,
                        category: selectedOptions.join(', '),
                      });
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    size={5}
                  >
                    {categories.filter(c => c.is_active).map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={newBusinessData.contact || ""}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        contact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newBusinessData.location || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newBusinessData.description || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Enter business description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={newBusinessData.openingHours || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      openingHours: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={newBusinessData.facebook || ""}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        facebook: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Facebook page URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={newBusinessData.instagram || ""}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        instagram: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu URL
                </label>
                <input
                  type="url"
                  value={newBusinessData.menuUrl || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      menuUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Link to menu or website"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TikTok
                  </label>
                  <input
                    type="url"
                    value={newBusinessData.tiktok || ""}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        tiktok: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="TikTok profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Map URL
                  </label>
                  <input
                    type="url"
                    value={newBusinessData.googleMapUrl || ""}
                    onChange={(e) =>
                      setNewBusinessData({
                        ...newBusinessData,
                        googleMapUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Google Maps link"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direction
                </label>
                <input
                  type="text"
                  value={newBusinessData.direction || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      direction: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Detailed address or directions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Logo/Image URL
                </label>
                <input
                  type="text"
                  value={newBusinessData.image || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      image: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="/businessname.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WiFi QR Code URL
                </label>
                <input
                  type="text"
                  value={newBusinessData.wifiQrCode || ""}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      wifiQrCode: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="/qrcodes/business-wifi.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newBusinessData.brandPrimaryColor || "#1e40af"}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          brandPrimaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newBusinessData.brandPrimaryColor || "#1e40af"}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          brandPrimaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newBusinessData.brandSecondaryColor || "#3b82f6"}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          brandSecondaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newBusinessData.brandSecondaryColor || "#3b82f6"}
                      onChange={(e) =>
                        setNewBusinessData({
                          ...newBusinessData,
                          brandSecondaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-business-active"
                  checked={newBusinessData.is_active !== false}
                  onChange={(e) =>
                    setNewBusinessData({
                      ...newBusinessData,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="new-business-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setAddingBusiness(false);
                  setNewBusinessData({});
                }}
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
      )}

      {/* Business Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Business
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={editingBusiness.name}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingBusiness.username}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded border border-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <select
                    multiple
                    value={editingBusiness.category?.split(', ') || []}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setEditingBusiness({
                        ...editingBusiness,
                        category: selectedOptions.join(', '),
                      });
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    size={5}
                  >
                    {categories.filter(c => c.is_active).map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={editingBusiness.contact}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        contact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingBusiness.location}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingBusiness.description}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={editingBusiness.openingHours}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      openingHours: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., 7 AM - 9 PM"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={editingBusiness.facebook}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        facebook: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={editingBusiness.instagram}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        instagram: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu URL
                </label>
                <input
                  type="url"
                  value={editingBusiness.menuUrl}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      menuUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TikTok
                  </label>
                  <input
                    type="url"
                    value={editingBusiness.tiktok}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        tiktok: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="TikTok profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Map URL
                  </label>
                  <input
                    type="url"
                    value={editingBusiness.googleMapUrl}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        googleMapUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="Google Maps link"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direction
                </label>
                <input
                  type="text"
                  value={editingBusiness.direction}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      direction: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="Detailed address or directions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Logo/Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const result = await response.json();
                          if (result.success) {
                            setEditingBusiness({
                              ...editingBusiness,
                              image: result.url,
                            });
                          } else {
                            alert("Upload failed: " + result.error);
                          }
                        } catch (error) {
                          alert("Upload error");
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                  <input
                    type="text"
                    value={editingBusiness.image}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        image: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="/businessname.jpg or paste URL"
                  />
                  {editingBusiness.image && (
                    <div className="mt-2">
                      <img
                        src={editingBusiness.image}
                        alt="Business logo preview"
                        className="h-20 w-20 object-cover rounded border border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WiFi QR Code
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const result = await response.json();
                          if (result.success) {
                            setEditingBusiness({
                              ...editingBusiness,
                              wifiQrCode: result.url,
                            });
                          } else {
                            alert("Upload failed: " + result.error);
                          }
                        } catch (error) {
                          alert("Upload error");
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  />
                  <input
                    type="text"
                    value={editingBusiness.wifiQrCode}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        wifiQrCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                    placeholder="/qrcodes/business-wifi.png or paste URL"
                  />
                  {editingBusiness.wifiQrCode && (
                    <div className="mt-2">
                      <img
                        src={editingBusiness.wifiQrCode}
                        alt="WiFi QR code preview"
                        className="h-20 w-20 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingBusiness.brandPrimaryColor}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          brandPrimaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingBusiness.brandPrimaryColor}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          brandPrimaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingBusiness.brandSecondaryColor}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          brandSecondaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingBusiness.brandSecondaryColor}
                      onChange={(e) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          brandSecondaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-business-active"
                  checked={editingBusiness.is_active}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="edit-business-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
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

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Business
                </label>
                <select
                  value={editingUser.business_id || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      business_id: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                >
                  <option value="">No Business Assigned</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name} (@{business.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="user-active"
                  checked={editingUser.is_active}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="user-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded hover:bg-red-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
