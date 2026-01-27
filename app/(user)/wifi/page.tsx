'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserSession, isOwner } from '@/lib/auth'
import { supabase, getBusinessWifi, addBusinessWifi, updateBusinessWifi, deleteBusinessWifi } from '@/lib/supabase'

interface Business {
  id: number
  name: string
  username: string
}

interface User {
  id: number
  username: string
  email: string
  full_name: string
  business_id: number | null
}

interface WifiNetwork {
  id?: number
  business_id?: number
  ssid: string
  password: string
  security_type: string
  is_hidden: boolean
}

export default function WifiManagement() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWifi, setEditingWifi] = useState<WifiNetwork | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<WifiNetwork>({
    ssid: '',
    password: '',
    security_type: 'WPA',
    is_hidden: false,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    if (!supabase) {
      router.push('/login')
      return
    }

    const userSession = getUserSession()
    if (!userSession) {
      router.push('/login')
      return
    }

    // Check if user is owner
    if (!isOwner(userSession)) {
      alert('You must be a business owner to manage WiFi.')
      router.push('/dashboard')
      return
    }

    const userData = {
      id: userSession.id,
      username: userSession.username,
      email: userSession.email,
      full_name: userSession.full_name,
      business_id: userSession.business_id
    }
    setUser(userData)

    if (userData.business_id) {
      await fetchBusiness(userData.business_id)
      await fetchWifiNetworks(userData.business_id)
    }

    setLoading(false)
  }

  const fetchBusiness = async (businessId: number) => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, username')
      .eq('id', businessId)
      .single()

    if (!error && data) {
      setBusiness(data)
    }
  }

  const fetchWifiNetworks = async (businessId: number) => {
    const data = await getBusinessWifi(businessId)
    setWifiNetworks(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!business) {
      alert('No business found')
      return
    }

    if (editingWifi && editingWifi.id) {
      // Update existing WiFi
      const result = await updateBusinessWifi(editingWifi.id, formData)
      if (result) {
        alert('WiFi network updated successfully!')
        await fetchWifiNetworks(business.id)
        resetForm()
      } else {
        alert('Error updating WiFi network')
      }
    } else {
      // Add new WiFi
      const wifiData = {
        ...formData,
        business_id: business.id,
      }
      const result = await addBusinessWifi(wifiData)
      if (result) {
        alert('WiFi network added successfully!')
        await fetchWifiNetworks(business.id)
        resetForm()
      } else {
        alert('Error adding WiFi network')
      }
    }
  }

  const handleEdit = (wifi: WifiNetwork) => {
    setEditingWifi(wifi)
    setFormData({
      ssid: wifi.ssid,
      password: wifi.password,
      security_type: wifi.security_type,
      is_hidden: wifi.is_hidden,
    })
    setShowForm(true)
  }

  const handleDelete = async (wifiId: number) => {
    if (!confirm('Are you sure you want to delete this WiFi network?')) {
      return
    }

    const result = await deleteBusinessWifi(wifiId)
    if (result) {
      alert('WiFi network deleted successfully!')
      if (business) {
        await fetchWifiNetworks(business.id)
      }
    } else {
      alert('Error deleting WiFi network')
    }
  }

  const resetForm = () => {
    setFormData({
      ssid: '',
      password: '',
      security_type: 'WPA',
      is_hidden: false,
    })
    setEditingWifi(null)
    setShowForm(false)
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
          <p className="text-gray-600 mb-4">You need to create a business first to manage WiFi networks.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">WiFi Management</h1>
          <p className="text-gray-600 mt-2">Manage WiFi networks for {business.name}</p>
        </div>

        {/* Add WiFi Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium"
            >
              + Add WiFi Network
            </button>
          </div>
        )}

        {/* Add/Edit WiFi Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingWifi ? 'Edit WiFi Network' : 'Add WiFi Network'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WiFi Name (SSID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ssid}
                  onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="e.g., MyBusinessWiFi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                  placeholder="WiFi password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Type
                </label>
                <select
                  value={formData.security_type}
                  onChange={(e) => setFormData({ ...formData, security_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED1D33]"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_hidden"
                  checked={formData.is_hidden}
                  onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                  className="w-4 h-4 text-[#ED1D33] rounded focus:ring-[#ED1D33]"
                />
                <label htmlFor="is_hidden" className="ml-2 text-sm text-gray-700">
                  Hidden Network
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium"
                >
                  {editingWifi ? 'Update WiFi' : 'Add WiFi'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* WiFi Networks List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">WiFi Networks</h2>
          
          {wifiNetworks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No WiFi networks added yet.</p>
          ) : (
            <div className="space-y-4">
              {wifiNetworks.map((wifi) => (
                <div
                  key={wifi.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900">{wifi.ssid}</h3>
                      </div>
                      <div className="ml-9 space-y-1 text-sm text-gray-600">
                        <p>Password: <span className="font-mono">{wifi.password}</span></p>
                        <p>Security: {wifi.security_type}</p>
                        {wifi.is_hidden && <p className="text-amber-600">Hidden Network</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(wifi)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => wifi.id && handleDelete(wifi.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
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
      </div>
    </div>
  )
}
