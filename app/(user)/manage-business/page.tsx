'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Business {
  id: number
  name: string
  username: string
  category: string
  location: string
  contact: string
  description: string
  image: string
  openinghours: string
  facebook: string
  instagram: string
  tiktok: string
  twitter: string
  youtube: string
  linkedin: string
  threads: string
  whatsapp: string
  website: string
  googlemapurl: string
  brandprimarycolor: string
  brandsecondarycolor: string
  is_active: boolean
}

interface MenuItem {
  id?: number
  name: string
  description: string
  price: number
  category: string
  is_available: boolean
  business_id?: number
}

interface WiFiNetwork {
  id?: number
  network_name: string
  password: string
  notes: string
  business_id?: number
}

interface Category {
  id: number
  name: string
}

export default function ManageBusinessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<Business | null>(null)
  const [activeTab, setActiveTab] = useState<'business' | 'menu' | 'wifi'>('business')
  const [isEditing, setIsEditing] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Business form
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    location: '',
    contact: '',
    description: '',
    image: '',
    openinghours: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    threads: '',
    whatsapp: '',
    website: '',
    googlemapurl: '',
    brandprimarycolor: '#ED1D33',
    brandsecondarycolor: '#000000',
  })

  // Menu management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [menuFormData, setMenuFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: '',
    is_available: true
  })

  // WiFi management
  const [wifiNetworks, setWiFiNetworks] = useState<WiFiNetwork[]>([])
  const [showWiFiForm, setShowWiFiForm] = useState(false)
  const [wifiFormData, setWiFiFormData] = useState<WiFiNetwork>({
    network_name: '',
    password: '',
    notes: ''
  })

  useEffect(() => {
    checkUserBusiness()
  }, [router])

  const checkUserBusiness = async () => {
    const session = localStorage.getItem('userSession')
    if (!session) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(session)
    
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data: user } = await supabase
        .from('users')
        .select('business_id, businesses(*)')
        .eq('id', userData.id)
        .single()

      if (user && user.business_id && user.businesses) {
        const biz = user.businesses as Business
        setBusiness(biz)
        setFormData({
          name: biz.name || '',
          username: biz.username || '',
          category: biz.category || '',
          location: biz.location || '',
          contact: biz.contact || '',
          description: biz.description || '',
          image: biz.image || '',
          openinghours: biz.openinghours || '',
          facebook: biz.facebook || '',
          instagram: biz.instagram || '',
          tiktok: biz.tiktok || '',
          twitter: biz.twitter || '',
          youtube: biz.youtube || '',
          linkedin: biz.linkedin || '',
          threads: biz.threads || '',
          whatsapp: biz.whatsapp || '',
          website: biz.website || '',
          googlemapurl: biz.googlemapurl || '',
          brandprimarycolor: biz.brandprimarycolor || '#ED1D33',
          brandsecondarycolor: biz.brandsecondarycolor || '#000000',
        })
        await fetchMenuItems(biz.id)
        await fetchWiFiNetworks(biz.id)
        await fetchCategories()
      } else {
        router.push('/add-business')
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (!supabase) return
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (data) setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchMenuItems = async (businessId: number) => {
    if (!supabase) return
    try {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', businessId)
        .order('name')
      if (data) setMenuItems(data)
    } catch (err) {
      console.error('Error fetching menu items:', err)
    }
  }

  const fetchWiFiNetworks = async (businessId: number) => {
    if (!supabase) return
    try {
      const { data } = await supabase
        .from('wifi_networks')
        .select('*')
        .eq('business_id', businessId)
      if (data) setWiFiNetworks(data)
    } catch (err) {
      console.error('Error fetching wifi networks:', err)
    }
  }

  const handleBusinessUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !supabase) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update(formData)
        .eq('id', business.id)

      if (error) {
        alert('Error updating business: ' + error.message)
      } else {
        alert('Business updated successfully!')
        setIsEditing(false)
        await checkUserBusiness()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Menu Functions
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !supabase) return

    const menuData = { ...menuFormData, business_id: business.id }
    
    try {
      if (menuFormData.id) {
        const { error } = await supabase
          .from('menu_items')
          .update(menuData)
          .eq('id', menuFormData.id)
        if (!error) alert('Menu item updated!')
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([menuData])
        if (!error) alert('Menu item added!')
      }
      setShowMenuForm(false)
      setMenuFormData({ name: '', description: '', price: 0, category: '', is_available: true })
      await fetchMenuItems(business.id)
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    }
  }

  const deleteMenuItem = async (id: number) => {
    if (!confirm('Delete this menu item?') || !supabase) return
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    
    if (!error && business) {
      alert('Menu item deleted!')
      await fetchMenuItems(business.id)
    }
  }

  // WiFi Functions
  const handleWiFiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !supabase) return

    const wifiData = { ...wifiFormData, business_id: business.id }
    
    try {
      if (wifiFormData.id) {
        const { error } = await supabase
          .from('wifi_networks')
          .update(wifiData)
          .eq('id', wifiFormData.id)
        if (!error) alert('WiFi network updated!')
      } else {
        const { error } = await supabase
          .from('wifi_networks')
          .insert([wifiData])
        if (!error) alert('WiFi network added!')
      }
      setShowWiFiForm(false)
      setWiFiFormData({ network_name: '', password: '', notes: '' })
      await fetchWiFiNetworks(business.id)
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred')
    }
  }

  const deleteWiFi = async (id: number) => {
    if (!confirm('Delete this WiFi network?') || !supabase) return
    
    const { error } = await supabase
      .from('wifi_networks')
      .delete()
      .eq('id', id)
    
    if (!error && business) {
      alert('WiFi network deleted!')
      await fetchWiFiNetworks(business.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!business) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Business</h1>
              <p className="text-gray-600 text-sm mt-1">{business.name}</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('business')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'business'
                  ? 'border-[#ED1D33] text-[#ED1D33]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 Business Details
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'menu'
                  ? 'border-[#ED1D33] text-[#ED1D33]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🍽️ Menu ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('wifi')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'wifi'
                  ? 'border-[#ED1D33] text-[#ED1D33]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📶 WiFi ({wifiNetworks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Details Tab */}
        {activeTab === 'business' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleBusinessUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      name="openinghours"
                      value={formData.openinghours}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Map URL</label>
                    <input
                      type="url"
                      name="googlemapurl"
                      value={formData.googlemapurl}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="Facebook URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="Instagram URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleChange}
                      placeholder="TikTok URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      placeholder="YouTube URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                    <input
                      type="url"
                      name="threads"
                      value={formData.threads}
                      onChange={handleChange}
                      placeholder="Threads URL"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                    />
                  </div>
                </div>

                {/* Brand Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          name="brandprimarycolor"
                          value={formData.brandprimarycolor}
                          onChange={handleChange}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.brandprimarycolor}
                          onChange={handleChange}
                          name="brandprimarycolor"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          name="brandsecondarycolor"
                          value={formData.brandsecondarycolor}
                          onChange={handleChange}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.brandsecondarycolor}
                          onChange={handleChange}
                          name="brandsecondarycolor"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-gray-900 mt-1">{business.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900 mt-1">@{business.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900 mt-1">{business.category || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900 mt-1">{business.location || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Contact</label>
                  <p className="text-gray-900 mt-1">{business.contact || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Opening Hours</label>
                  <p className="text-gray-900 mt-1">{business.openinghours || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{business.description || '-'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
                <button
                  onClick={() => {
                    setShowMenuForm(true)
                    setMenuFormData({ name: '', description: '', price: 0, category: '', is_available: true })
                  }}
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  + Add Item
                </button>
              </div>

              {showMenuForm && (
                <form onSubmit={handleMenuSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item Name *"
                      value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price *"
                      value={menuFormData.price || ''}
                      onChange={(e) => setMenuFormData({ ...menuFormData, price: parseFloat(e.target.value) })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={menuFormData.category}
                      onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={menuFormData.is_available}
                        onChange={(e) => setMenuFormData({ ...menuFormData, is_available: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label className="text-sm">Available</label>
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        placeholder="Description"
                        value={menuFormData.description}
                        onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      {menuFormData.id ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMenuForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        {!item.is_available && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Unavailable</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium text-[#ED1D33]">Rs. {item.price}</span>
                        {item.category && <span className="text-xs text-gray-500">{item.category}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMenuFormData(item)
                          setShowMenuForm(true)
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => item.id && deleteMenuItem(item.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No menu items yet. Add your first item!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WiFi Tab */}
        {activeTab === 'wifi' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">WiFi Networks</h2>
                <button
                  onClick={() => {
                    setShowWiFiForm(true)
                    setWiFiFormData({ network_name: '', password: '', notes: '' })
                  }}
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  + Add WiFi
                </button>
              </div>

              {showWiFiForm && (
                <form onSubmit={handleWiFiSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Network Name *"
                      value={wifiFormData.network_name}
                      onChange={(e) => setWiFiFormData({ ...wifiFormData, network_name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Password *"
                      value={wifiFormData.password}
                      onChange={(e) => setWiFiFormData({ ...wifiFormData, password: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <div className="md:col-span-2">
                      <textarea
                        placeholder="Notes (optional)"
                        value={wifiFormData.notes}
                        onChange={(e) => setWiFiFormData({ ...wifiFormData, notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      {wifiFormData.id ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWiFiForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {wifiNetworks.map((wifi) => (
                  <div key={wifi.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">📶 {wifi.network_name}</h3>
                      <p className="text-sm text-gray-600 font-mono mt-1">🔑 {wifi.password}</p>
                      {wifi.notes && <p className="text-sm text-gray-500 mt-1">{wifi.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setWiFiFormData(wifi)
                          setShowWiFiForm(true)
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => wifi.id && deleteWiFi(wifi.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {wifiNetworks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No WiFi networks added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
