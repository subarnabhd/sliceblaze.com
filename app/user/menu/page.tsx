'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  supabase,
  getMenuCategories,
  getMenuSubcategories,
  getMenuItems,
  addMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  addMenuSubcategory,
  updateMenuSubcategory,
  deleteMenuSubcategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '@/lib/supabase'

interface Business {
  id: number
  name: string
}

interface User {
  id: number
  business_id: number | null
}

interface Category {
  id: number
  business_id: number
  name: string
  display_order: number
  is_active: boolean
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  display_order: number
  is_active: boolean
}

interface MenuItem {
  id: number
  subcategory_id: number
  name: string
  description: string
  price: number
  image: string
  display_order: number
  is_active: boolean
}

export default function UserMenuManagement() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [categoryForm, setCategoryForm] = useState({ name: '', display_order: 0, is_active: true })
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', display_order: 0, is_active: true })
  const [itemForm, setItemForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    image: '', 
    display_order: 0, 
    is_active: true 
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (!supabase) {
      router.push('/login')
      return
    }

    const userSession = localStorage.getItem('userSession')
    if (!userSession) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(userSession)
    setUser(userData)

    if (userData.business_id) {
      await fetchBusiness(userData.business_id)
      await fetchCategories(userData.business_id)
    }

    setLoading(false)
  }

  const fetchBusiness = async (businessId: number) => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', businessId)
      .single()

    if (!error && data) {
      setBusiness(data)
    }
  }

  const fetchCategories = async (businessId: number) => {
    const data = await getMenuCategories(businessId)
    setCategories(data)
  }

  const fetchSubcategories = async (categoryId: number) => {
    const data = await getMenuSubcategories(categoryId)
    setSubcategories(data)
  }

  const fetchItems = async (subcategoryId: number) => {
    const data = await getMenuItems(subcategoryId)
    setItems(data)
  }

  // Category handlers
  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    await fetchSubcategories(category.id)
    setItems([])
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return

    const result = await addMenuCategory({
      business_id: business.id,
      ...categoryForm
    })

    if (result) {
      alert('Category added successfully!')
      await fetchCategories(business.id)
      setCategoryForm({ name: '', display_order: 0, is_active: true })
      setShowCategoryForm(false)
    } else {
      alert('Error adding category. Please check the console for details.')
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory || !business) return

    const result = await updateMenuCategory(editingCategory.id, categoryForm)

    if (result) {
      alert('Category updated successfully!')
      await fetchCategories(business.id)
      setEditingCategory(null)
      setCategoryForm({ name: '', display_order: 0, is_active: true })
      setShowCategoryForm(false)
    } else {
      alert('Error updating category')
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Delete this category? This will also delete all subcategories and items.')) return
    if (!business) return

    const result = await deleteMenuCategory(categoryId)
    if (result) {
      alert('Category deleted successfully!')
      await fetchCategories(business.id)
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null)
        setSubcategories([])
        setItems([])
      }
    } else {
      alert('Error deleting category')
    }
  }

  // Subcategory handlers
  const handleSubcategorySelect = async (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory)
    await fetchItems(subcategory.id)
  }

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    const result = await addMenuSubcategory({
      category_id: selectedCategory.id,
      ...subcategoryForm
    })

    if (result) {
      alert('Subcategory added successfully!')
      await fetchSubcategories(selectedCategory.id)
      setSubcategoryForm({ name: '', display_order: 0, is_active: true })
      setShowSubcategoryForm(false)
    } else {
      alert('Error adding subcategory')
    }
  }

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubcategory || !selectedCategory) return

    const result = await updateMenuSubcategory(editingSubcategory.id, subcategoryForm)

    if (result) {
      alert('Subcategory updated successfully!')
      await fetchSubcategories(selectedCategory.id)
      setEditingSubcategory(null)
      setSubcategoryForm({ name: '', display_order: 0, is_active: true })
      setShowSubcategoryForm(false)
    } else {
      alert('Error updating subcategory')
    }
  }

  const handleDeleteSubcategory = async (subcategoryId: number) => {
    if (!confirm('Delete this subcategory? This will also delete all items.')) return
    if (!selectedCategory) return

    const result = await deleteMenuSubcategory(subcategoryId)
    if (result) {
      alert('Subcategory deleted successfully!')
      await fetchSubcategories(selectedCategory.id)
      if (selectedSubcategory?.id === subcategoryId) {
        setSelectedSubcategory(null)
        setItems([])
      }
    } else {
      alert('Error deleting subcategory')
    }
  }

  // Item handlers
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubcategory) return

    const result = await addMenuItem({
      subcategory_id: selectedSubcategory.id,
      ...itemForm,
      price: parseFloat(itemForm.price)
    })

    if (result) {
      alert('Item added successfully!')
      await fetchItems(selectedSubcategory.id)
      setItemForm({ name: '', description: '', price: '', image: '', display_order: 0, is_active: true })
      setShowItemForm(false)
    } else {
      alert('Error adding item')
    }
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem || !selectedSubcategory) return

    const result = await updateMenuItem(editingItem.id, {
      ...itemForm,
      price: parseFloat(itemForm.price)
    })

    if (result) {
      alert('Item updated successfully!')
      await fetchItems(selectedSubcategory.id)
      setEditingItem(null)
      setItemForm({ name: '', description: '', price: '', image: '', display_order: 0, is_active: true })
      setShowItemForm(false)
    } else {
      alert('Error updating item')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Delete this item?')) return
    if (!selectedSubcategory) return

    const result = await deleteMenuItem(itemId)
    if (result) {
      alert('Item deleted successfully!')
      await fetchItems(selectedSubcategory.id)
    } else {
      alert('Error deleting item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Business Found</h1>
          <p className="text-gray-600 mb-4">Create a business first to manage menus.</p>
          <button
            onClick={() => router.push('/user/dashboard')}
            className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 text-sm mt-1">{business.name}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-4 sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                <button
                  onClick={() => {
                    setCategoryForm({ name: '', display_order: categories.length, is_active: true })
                    setEditingCategory(null)
                    setShowCategoryForm(true)
                  }}
                  className="p-1.5 bg-[#ED1D33] text-white rounded hover:bg-[#C91828]"
                  title="Add Category"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {showCategoryForm && (
                <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="mb-4 p-3 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Category name"
                    className="w-full px-2 py-1.5 text-sm border rounded mb-2"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 px-3 py-1.5 bg-[#ED1D33] text-white text-sm rounded">
                      {editingCategory ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false)
                        setEditingCategory(null)
                      }}
                      className="px-3 py-1.5 bg-gray-300 text-gray-800 text-sm rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-2 rounded cursor-pointer group ${
                      selectedCategory?.id === cat.id ? 'bg-[#ED1D33] text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div onClick={() => handleCategorySelect(cat)} className="flex-1">
                      <div className="font-medium text-sm">{cat.name}</div>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCategoryForm({ name: cat.name, display_order: cat.display_order, is_active: cat.is_active })
                          setEditingCategory(cat)
                          setShowCategoryForm(true)
                        }}
                        className={`px-2 py-1 text-xs rounded ${selectedCategory?.id === cat.id ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCategory(cat.id)
                        }}
                        className={`px-2 py-1 text-xs rounded ${selectedCategory?.id === cat.id ? 'bg-white/20 hover:bg-white/30' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {!selectedCategory ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Category Selected</h3>
                <p className="text-gray-600">Select a category or create a new one to start managing your menu</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subcategories */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Subcategories</h2>
                    <button
                      onClick={() => {
                        setSubcategoryForm({ name: '', display_order: subcategories.length, is_active: true })
                        setEditingSubcategory(null)
                        setShowSubcategoryForm(true)
                      }}
                      className="px-3 py-1.5 bg-[#ED1D33] text-white text-sm rounded hover:bg-[#C91828]"
                    >
                      + Add
                    </button>
                  </div>

                  {showSubcategoryForm && (
                    <form onSubmit={editingSubcategory ? handleUpdateSubcategory : handleAddSubcategory} className="mb-4 p-3 bg-gray-50 rounded">
                      <input
                        type="text"
                        value={subcategoryForm.name}
                        onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                        placeholder="Subcategory name"
                        className="w-full px-2 py-1.5 text-sm border rounded mb-2"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 px-3 py-1.5 bg-[#ED1D33] text-white text-sm rounded">
                          {editingSubcategory ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSubcategoryForm(false)
                            setEditingSubcategory(null)
                          }}
                          className="px-3 py-1.5 bg-gray-300 text-gray-800 text-sm rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className={`p-3 rounded cursor-pointer ${
                          selectedSubcategory?.id === sub.id ? 'bg-[#ED1D33] text-white' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div onClick={() => handleSubcategorySelect(sub)}>
                          <div className="font-medium">{sub.name}</div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSubcategoryForm({ name: sub.name, display_order: sub.display_order, is_active: sub.is_active })
                              setEditingSubcategory(sub)
                              setShowSubcategoryForm(true)
                            }}
                            className={`px-2 py-1 text-xs rounded ${selectedSubcategory?.id === sub.id ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-100 text-blue-700'}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSubcategory(sub.id)
                            }}
                            className={`px-2 py-1 text-xs rounded ${selectedSubcategory?.id === sub.id ? 'bg-white/20 hover:bg-white/30' : 'bg-red-100 text-red-700'}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Items</h2>
                    {selectedSubcategory && (
                      <button
                        onClick={() => {
                          setItemForm({ name: '', description: '', price: '', image: '', display_order: items.length, is_active: true })
                          setEditingItem(null)
                          setShowItemForm(true)
                        }}
                        className="px-3 py-1.5 bg-[#ED1D33] text-white text-sm rounded hover:bg-[#C91828]"
                      >
                        + Add
                      </button>
                    )}
                  </div>

                  {!selectedSubcategory ? (
                    <div className="text-center py-8 text-gray-500">
                      Select a subcategory to view items
                    </div>
                  ) : (
                    <>
                      {showItemForm && (
                        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="mb-4 p-3 bg-gray-50 rounded space-y-2">
                          <input
                            type="text"
                            value={itemForm.name}
                            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                            placeholder="Item name"
                            className="w-full px-2 py-1.5 text-sm border rounded"
                            required
                          />
                          <textarea
                            value={itemForm.description}
                            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                            placeholder="Description"
                            className="w-full px-2 py-1.5 text-sm border rounded"
                            rows={2}
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={itemForm.price}
                            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                            placeholder="Price"
                            className="w-full px-2 py-1.5 text-sm border rounded"
                            required
                          />
                          <input
                            type="url"
                            value={itemForm.image}
                            onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                            placeholder="Image URL (optional)"
                            className="w-full px-2 py-1.5 text-sm border rounded"
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 px-3 py-1.5 bg-[#ED1D33] text-white text-sm rounded">
                              {editingItem ? 'Update' : 'Add'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowItemForm(false)
                                setEditingItem(null)
                              }}
                              className="px-3 py-1.5 bg-gray-300 text-gray-800 text-sm rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              </div>
                              <div className="text-[#ED1D33] font-bold ml-2">${item.price.toFixed(2)}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setItemForm({ 
                                    name: item.name, 
                                    description: item.description, 
                                    price: item.price.toString(), 
                                    image: item.image || '', 
                                    display_order: item.display_order, 
                                    is_active: item.is_active 
                                  })
                                  setEditingItem(item)
                                  setShowItemForm(true)
                                }}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
