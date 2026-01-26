'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  description: string
  icon: string
  created_at: string
  business_count?: number
}

export default function CategoryManagement() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📂'
  })

  useEffect(() => {
    checkAuth()
    fetchCategories()
  }, [])

  const checkAuth = () => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin')
    }
  }

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError

      // Get business count for each category
      const { data: businessesData } = await supabase
        .from('businesses')
        .select('category')

      const businessCountByCategory: { [key: string]: number } = {}
      businessesData?.forEach(b => {
        if (b.category) {
          businessCountByCategory[b.category] = (businessCountByCategory[b.category] || 0) + 1
        }
      })

      const categoriesWithCount = (categoriesData || []).map(cat => ({
        ...cat,
        business_count: businessCountByCategory[cat.name] || 0
      }))

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"? This will not delete businesses in this category.`)) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      name: '',
      description: '',
      icon: '📂'
    })
    setShowModal(true)
  }

  const openEditModal = (category: Category) => {
    setModalMode('edit')
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '📂'
    })
    setShowModal(true)
  }

  const openViewModal = (category: Category) => {
    setModalMode('view')
    setSelectedCategory(category)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (modalMode === 'create') {
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            description: formData.description,
            icon: formData.icon
          }])

        if (error) throw error
        alert('Category created successfully!')
      } else if (modalMode === 'edit' && selectedCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            icon: formData.icon
          })
          .eq('id', selectedCategory.id)

        if (error) throw error
        alert('Category updated successfully!')
      }

      setShowModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
          <p className="text-gray-600 text-sm mt-1">Category Management</p>
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
          <Link
            href="/admin/category-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ED1D33] text-white transition"
          >
            <span className="text-lg">📂</span>
            <span className="font-medium">Category Management</span>
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <p className="text-gray-600 text-sm mt-1">Manage business categories</p>
              </div>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <span className="text-lg">➕</span>
                Create New Category
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
            />
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
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Businesses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{category.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{category.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {category.business_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openViewModal(category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id, category.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No categories found
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
                {modalMode === 'create' && 'Create New Category'}
                {modalMode === 'edit' && 'Edit Category'}
                {modalMode === 'view' && 'View Category Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {modalMode === 'view' && selectedCategory ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon</label>
                  <p className="mt-1 text-4xl">{selectedCategory.icon}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category Name</label>
                  <p className="mt-1 text-gray-900">{selectedCategory.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{selectedCategory.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Businesses</label>
                  <p className="mt-1">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {selectedCategory.business_count || 0} businesses
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="mt-1 text-gray-900">{new Date(selectedCategory.created_at).toLocaleDateString()}</p>
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
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="Category description..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent text-2xl"
                    placeholder="📂"
                    maxLength={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">Use an emoji to represent this category</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {modalMode === 'create' ? 'Create Category' : 'Update Category'}
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
