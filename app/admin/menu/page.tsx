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
  username: string
}

export default function AdminMenuManagement() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin - Menu Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage menus for all businesses</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/dashboard')}
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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Management</h3>
          <p className="text-gray-600 mb-6">Select a business from the dashboard to manage their menu</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {businesses.map((business) => (
              <a
                key={business.id}
                href={`/${business.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#ED1D33] hover:bg-gray-100 transition-colors text-left"
              >
                <h4 className="font-semibold text-gray-900">{business.name}</h4>
                <p className="text-sm text-gray-500 mt-1">@{business.username}</p>
                <p className="text-xs text-[#ED1D33] mt-2">View Profile →</p>
              </a>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              For full menu management, business owners should use their dashboard at{' '}
              <a href="/user/menu" className="text-[#ED1D33] hover:underline">/user/menu</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
