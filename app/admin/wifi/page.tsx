'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getBusinessWifi, addBusinessWifi, updateBusinessWifi, deleteBusinessWifi } from '@/lib/supabase'

interface Business {
  id: number
  name: string
  username: string
}

interface WifiNetwork {
  id?: number
  business_id?: number
  ssid: string
  password: string
  security_type: string
  is_hidden: boolean
}

export default function AdminWifiManagement() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
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
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      router.push('/admin')
      return
    }

    await fetchBusinesses()
    setLoading(false)
  }

  const fetchBusinesses = async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, username')
      .order('name')

    if (!error && data) {
      setBusinesses(data)
    }
  }

  const fetchWifiNetworks = async (businessId: number) => {
    const data = await getBusinessWifi(businessId)
    setWifiNetworks(data)
  }

  const handleBusinessSelect = async (business: Business) => {
    setSelectedBusiness(business)
    await fetchWifiNetworks(business.id)
    setShowForm(false)
    setEditingWifi(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBusiness) {
      alert('Please select a business first')
      return
    }

    if (editingWifi && editingWifi.id) {
      // Update existing WiFi
      const result = await updateBusinessWifi(editingWifi.id, formData)
      if (result) {
        alert('WiFi network updated successfully!')
        await fetchWifiNetworks(selectedBusiness.id)
        resetForm()
      } else {
        alert('Error updating WiFi network')
      }
    } else {
      // Add new WiFi
      const wifiData = {
        ...formData,
        business_id: selectedBusiness.id,
      }
      const result = await addBusinessWifi(wifiData)
      if (result) {
        alert('WiFi network added successfully!')
        await fetchWifiNetworks(selectedBusiness.id)
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
      if (selectedBusiness) {
        await fetchWifiNetworks(selectedBusiness.id)
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

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin - WiFi Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage WiFi networks for all businesses</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/overview')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Business Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Business</h2>
              <div className="space-y-2 max-h-150 overflow-y-auto">
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessSelect(business)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedBusiness?.id === business.id
                        ? 'bg-[#ED1D33] text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold">{business.name}</div>
                    <div className={`text-sm ${selectedBusiness?.id === business.id ? 'text-white/80' : 'text-gray-500'}`}>
                      @{business.username}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* WiFi Management Content */}
          <div className="lg:col-span-2">
            {!selectedBusiness ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Business Selected</h3>
                <p className="text-gray-600">Select a business from the left to manage its WiFi networks</p>
              </div>
            ) : (
              <>
                {/* Add WiFi Button */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedBusiness.name}</h2>
                      <p className="text-gray-600">@{selectedBusiness.username}</p>
                    </div>
                    {!showForm && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] font-medium"
                      >
                        + Add WiFi Network
                      </button>
                    )}
                  </div>
                </div>

                {/* Add/Edit WiFi Form */}
                {showForm && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingWifi ? 'Edit WiFi Network' : 'Add WiFi Network'}
                    </h3>
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
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">WiFi Networks</h3>
                  
                  {wifiNetworks.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                        />
                      </svg>
                      <p className="text-gray-500">No WiFi networks added yet</p>
                    </div>
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
                                <h4 className="text-lg font-semibold text-gray-900">{wifi.ssid}</h4>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
