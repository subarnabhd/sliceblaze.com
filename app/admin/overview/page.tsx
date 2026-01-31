'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

interface Stats {
  totalBusinesses: number
  activeBusinesses: number
  inactiveBusinesses: number
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
  regularUsers: number
  ownerUsers: number
  totalMenuItems: number
  menuItemsByBusiness: { business_name: string; count: number }[]
  totalWifiNetworks: number
  wifiNetworksByBusiness: { business_name: string; count: number }[]
  businessesByCategory: { name: string; count: number }[]
  totalCategories: number
}

export default function AdminOverview() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    activeBusinesses: 0,
    inactiveBusinesses: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    ownerUsers: 0,
    totalMenuItems: 0,
    menuItemsByBusiness: [],
    totalWifiNetworks: 0,
    wifiNetworksByBusiness: [],
    businessesByCategory: [],
    totalCategories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin')
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    if (!supabase) return
    
    setLoading(true)

    try {
      const [
        businessesResult,
        usersResult,
        menuItemsResult,
        wifiNetworksResult
      ] = await Promise.all([
        supabase.from('businesses').select('*'),
        supabase.from('users').select('*'),
        supabase.from('menu_items').select('*, businesses(name)'),
        supabase.from('wifi_networks').select('*, businesses(name)')
      ])

      const businesses = businessesResult.data || []
      const activeBusinesses = businesses.filter(b => b.is_active).length
      const inactiveBusinesses = businesses.length - activeBusinesses

      // Category statistics
      const categoryCount: { [key: string]: number } = {}
      businesses.forEach(b => {
        if (b.category) {
          categoryCount[b.category] = (categoryCount[b.category] || 0) + 1
        }
      })
      const businessesByCategory = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      // User statistics
      const users = usersResult.data || []
      const activeUsers = users.filter(u => u.is_active !== false).length
      const inactiveUsers = users.length - activeUsers
      const adminUsers = users.filter(u => u.role === 'admin').length
      const ownerUsers = users.filter(u => u.role === 'owner').length
      const regularUsers = users.filter(u => u.role === 'user').length

      // Menu statistics
      const menuItems = menuItemsResult.data || []
      const menuByBusiness: { [key: string]: number } = {}
      menuItems.forEach(item => {
        const businessName = item.businesses?.name || 'Unknown'
        menuByBusiness[businessName] = (menuByBusiness[businessName] || 0) + 1
      })
      const menuItemsByBusiness = Object.entries(menuByBusiness)
        .map(([business_name, count]) => ({ business_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // WiFi statistics
      const wifiNetworks = wifiNetworksResult.data || []
      const wifiByBusiness: { [key: string]: number } = {}
      wifiNetworks.forEach(wifi => {
        const businessName = wifi.businesses?.name || 'Unknown'
        wifiByBusiness[businessName] = (wifiByBusiness[businessName] || 0) + 1
      })
      const wifiNetworksByBusiness = Object.entries(wifiByBusiness)
        .map(([business_name, count]) => ({ business_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalBusinesses: businesses.length,
        activeBusinesses,
        inactiveBusinesses,
        totalUsers: users.length,
        activeUsers,
        inactiveUsers,
        adminUsers,
        regularUsers,
        ownerUsers,
        totalMenuItems: menuItems.length,
        menuItemsByBusiness,
        totalWifiNetworks: wifiNetworks.length,
        wifiNetworksByBusiness,
        businessesByCategory,
        totalCategories: businessesByCategory.length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="relative">
        <AdminSidebar active="overview" />
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Businesses Card */}
          <Link href="/admin/business-management" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Businesses</p>
              <div className="text-4xl">🏢</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBusinesses}</p>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-green-600">✓ {stats.activeBusinesses} active</p>
              <p className="text-sm text-red-600">✗ {stats.inactiveBusinesses} inactive</p>
            </div>
          </Link>

          {/* Users Card */}
          <Link href="/admin/user-management" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Users</p>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-purple-600">👑 {stats.adminUsers} admins</p>
              <p className="text-sm text-blue-600">👤 {stats.regularUsers} regular</p>
              <p className="text-sm text-orange-600">🏪 {stats.ownerUsers} owners</p>
            </div>
          </Link>

          {/* Menu Items Card */}
          <Link href="/admin/menu" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Menu Items</p>
              <div className="text-4xl">🍕</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMenuItems}</p>
            <p className="text-sm text-gray-500 mt-3">Across all businesses</p>
          </Link>

          {/* WiFi Networks Card */}
          <Link href="/admin/wifi" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">WiFi Networks</p>
              <div className="text-4xl">📶</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalWifiNetworks}</p>
            <p className="text-sm text-gray-500 mt-3">Active configurations</p>
          </Link>

          {/* Categories Card */}
          <Link href="/admin/category-management" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <div className="text-4xl">📂</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
            <p className="text-sm text-gray-500 mt-3">Business categories</p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/business-management"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">➕</span>
                <span className="font-medium">Manage Businesses</span>
              </Link>
              <Link
                href="/admin/user-management"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">👤</span>
                <span className="font-medium">Manage Users</span>
              </Link>
              <Link
                href="/admin/menu"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">📋</span>
                <span className="font-medium">Manage Menus</span>
              </Link>
              <Link
                href="/admin/wifi"
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition"
              >
                <span className="text-2xl">📡</span>
                <span className="font-medium">Manage WiFi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Businesses by Category */}
        {stats.businessesByCategory.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Businesses by Category ({stats.totalCategories} Categories)</h2>
            </div>
            <div className="p-6">
              {/* Bar Chart */}
              <div className="mb-6 space-y-3">
                {stats.businessesByCategory.map((category, index) => {
                  const maxCount = stats.businessesByCategory[0]?.count || 1
                  const percentage = (category.count / maxCount) * 100
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.count} businesses</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-[#ED1D33] h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-xs text-white font-semibold">{category.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Details */}
        {stats.menuItemsByBusiness.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Menu Items by Business</h2>
              <p className="text-sm text-gray-600 mt-1">Top 5 businesses with most menu items</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.menuItemsByBusiness.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🍕</span>
                      <span className="font-medium text-gray-900">{item.business_name}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WiFi Networks Details */}
        {stats.wifiNetworksByBusiness.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">WiFi Networks by Business</h2>
              <p className="text-sm text-gray-600 mt-1">Top 5 businesses with most WiFi configurations</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.wifiNetworksByBusiness.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📶</span>
                      <span className="font-medium text-gray-900">{item.business_name}</span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
