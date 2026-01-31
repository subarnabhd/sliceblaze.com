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
  image_url: string
  created_at: string
  business_count?: number
}

export default function CategoryManagement() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📂',
    image_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Popular emoji options for categories
  const emojiOptions = [
    '🍽️', '☕', '🍺', '🍔', '🥖', '🍕', '🍣', '🍛', '🥡', '🍝',
    '🌮', '🍰', '🍻', '🏪', '🏢', '🛒', '🎭', '🎨', '💼', '🏥',
    '✈️', '🏋️', '💇', '🚗', '🏠', '🎓', '📚', '🎵', '🎮', '⚽',
    '👔', '👗', '💍', '🔧', '🔨', '🌸', '🐾', '🍷', '🧁', '🥗',
    '🍜', '🍱', '🥘', '🍲', '🥟', '🍞', '🥐', '🧀', '🥓', '🍳'
  ]

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
      icon: '📂',
      image_url: ''
    })
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
    setShowEmojiPicker(false)
  }

  const openEditModal = (category: Category) => {
    setModalMode('edit')
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '📂',
      image_url: category.image_url || ''
    })
    setImageFile(null)
    setImagePreview(category.image_url || '')
    setShowModal(true)
  }

  const openViewModal = (category: Category) => {
    setModalMode('view')
    setSelectedCategory(category)
    setShowModal(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      alert('Database connection not available')
      return
    }

    try {
      // Upload image if a new file was selected
      let imageUrl = formData.image_url
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      if (modalMode === 'create') {
        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            image_url: imageUrl
          }])
          .select()

        if (error) {
          console.error('Insert error details:', JSON.stringify(error, null, 2))
          alert(`Error creating category: ${error.message || error.hint || 'Please check if the categories table exists'}`)
          return
        }
        alert('Category created successfully!')
      } else if (modalMode === 'edit' && selectedCategory) {
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            image_url: imageUrl
          })
          .eq('id', selectedCategory.id)
          .select()

        if (error) {
          console.error('Update error details:', {
            error,
            message: error.message,
            hint: error.hint,
            details: error.details,
            code: error.code,
            full: JSON.stringify(error)
          })
          alert(`Error updating category: ${error.message || error.hint || 'Database error - check browser console'}`)
          return
        }
        alert('Category updated successfully!')
      }

      setShowModal(false)
      setShowEmojiPicker(false)
      setImageFile(null)
      setImagePreview('')
      fetchCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      const errorMsg = error?.message || error?.error_description || 'Unknown error occurred'
      alert(`Error: ${errorMsg}. Make sure the categories table exists in Supabase with columns: id, name, description, icon, image_url, created_at`)
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
        <div className="relative">
          <AdminSidebar active="category-management" />
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
import AdminSidebar from '@/components/AdminSidebar'

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
                      Image
                    </th>
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
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{category.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</div>
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
                {selectedCategory.image_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={selectedCategory.image_url} 
                        alt={selectedCategory.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
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
                    placeholder="Brief description of this category..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or upload an image below</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ED1D33] file:text-white hover:file:bg-red-700 file:cursor-pointer"
                  />
                  {(imagePreview || formData.image_url) && (
                    <div className="mt-3 border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview || formData.image_url} 
                        alt="Category preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Optional: Upload or provide URL for a category image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji) *
                  </label>
                  
                  {/* Current Icon Display */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl border-2 border-gray-300">
                      {formData.icon || '📂'}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent text-2xl"
                        placeholder="📂"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {/* Emoji Picker Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-sm text-[#ED1D33] hover:underline mb-2 flex items-center gap-1"
                  >
                    {showEmojiPicker ? '▼' : '▶'} {showEmojiPicker ? 'Hide' : 'Show'} emoji picker
                  </button>

                  {/* Emoji Grid */}
                  {showEmojiPicker && (
                    <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-8 gap-2">
                        {emojiOptions.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, icon: emoji })
                              setShowEmojiPicker(false)
                            }}
                            className={`text-2xl p-2 rounded hover:bg-white transition ${
                              formData.icon === emoji ? 'bg-[#ED1D33] bg-opacity-10 ring-2 ring-[#ED1D33]' : ''
                            }`}
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Click an emoji above or type/paste one directly
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>{modalMode === 'create' ? 'Create Category' : 'Update Category'}</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
