'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getUserSession, isOwner, logout as authLogout, refreshUserSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import { 
  ListIcon, 
  EditIcon, 
  UserCircleIcon, 
  BusinessIcon,
  SearchIcon,
  ContactIcon,
  PlusIcon
} from '@/icons/Icons'
import { DashboardIcon, UserIcon } from '@/icons/AccountSectionIcons'

interface Business {
  id: number
  name: string
  username: string
  location: string
  category: string
  contact: string
  description: string
  website: string
  openinghours: string
  logo: string
  cover_image: string
  photos: string[]
  facebook: string
  instagram: string
  twitter: string
  tiktok?: string
  youtube?: string
  linkedin?: string
  threads?: string
  whatsapp?: string
  googlemapurl?: string
  brandprimarycolor: string
  brandsecondarycolor: string
  is_active: boolean
}

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: 'admin' | 'owner' | 'user'
  business_id: number | null
}

interface DashboardStats {
  totalMenuItems: number
  totalWifiNetworks: number
  activeMenuItems: number
  businessViews: number
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileFormData, setProfileFormData] = useState({
    full_name: '',
    email: '',
    username: '',
  })
  const [passwordFormData, setPasswordFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    location: '',
    category: '',
    contact: '',
    description: '',
    website: '',
    openinghours: '',
    businesslogo: '',
    businesscover: '',
    businessphotos: [] as string[],
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    threads: '',
    whatsapp: '',
    googlemapurl: '',
    brandprimarycolor: '',
    brandsecondarycolor: '',
  })
  const [stats, setStats] = useState<DashboardStats>({
    totalMenuItems: 0,
    totalWifiNetworks: 0,
    activeMenuItems: 0,
    businessViews: 0
  })

  const fetchOwnerData = useCallback(async (businessId: number) => {
    if (!supabase) return

    try {
      // Fetch business data
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single()

      if (businessData) {
        setBusiness(businessData)
        // Prefill edit form data
        setEditFormData({
          name: businessData.name || '',
          username: businessData.username || '',
          location: businessData.location || '',
          category: businessData.category || '',
          contact: businessData.contact || '',
          description: businessData.description || '',
          website: businessData.website || '',
          openinghours: businessData.openinghours || '',
          businesslogo: businessData.businesslogo || '',
          businesscover: businessData.businesscover || '',
          businessphotos: businessData.businessphotos || [],
          facebook: businessData.facebook || '',
          instagram: businessData.instagram || '',
          twitter: businessData.twitter || '',
          tiktok: businessData.tiktok || '',
          youtube: businessData.youtube || '',
          linkedin: businessData.linkedin || '',
          threads: businessData.threads || '',
          whatsapp: businessData.whatsapp || '',
          googlemapurl: businessData.googlemapurl || '',
          brandprimarycolor: businessData.brandprimarycolor || '',
          brandsecondarycolor: businessData.brandsecondarycolor || '',
        })
      }

      // Fetch menu items
      const { data: menuData } = await supabase
        .from('menu_items')
        .select('id, is_available')
        .eq('business_id', businessId)

      const totalMenuItems = menuData?.length || 0
      const activeMenuItems = menuData?.filter(item => item.is_available).length || 0

      // Fetch wifi networks
      const { data: wifiData } = await supabase
        .from('wifi_networks')
        .select('id')
        .eq('business_id', businessId)

      const totalWifiNetworks = wifiData?.length || 0

      setStats({
        totalMenuItems,
        totalWifiNetworks,
        activeMenuItems,
        businessViews: 0 // Placeholder for future implementation
      })
    } catch (error) {
      console.error('Error fetching owner data:', error)
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const session = getUserSession()
    if (!session) {
      router.push('/login')
      return
    }

    // Refresh session from database to get latest data
    const refreshedSession = await refreshUserSession(session.id)
    if (!refreshedSession) {
      router.push('/login')
      return
    }

    setUser({
      id: refreshedSession.id,
      username: refreshedSession.username,
      email: refreshedSession.email,
      full_name: refreshedSession.full_name,
      role: refreshedSession.role,
      business_id: refreshedSession.business_id
    })

    // Prefill profile form data
    setProfileFormData({
      full_name: refreshedSession.full_name || '',
      email: refreshedSession.email || '',
      username: refreshedSession.username || '',
    })

    // If user is owner, fetch business data
    if (isOwner(refreshedSession)) {
      await fetchOwnerData(refreshedSession.business_id!)
    }

    setLoading(false)
  }, [router, fetchOwnerData])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Listen for change password event from header
  useEffect(() => {
    const handleOpenChangePassword = () => {
      setShowChangePassword(true)
    }

    window.addEventListener('openChangePassword', handleOpenChangePassword)
    return () => window.removeEventListener('openChangePassword', handleOpenChangePassword)
  }, [])

  const handleLogout = () => {
    authLogout()
    router.push('/login')
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileFormData.full_name,
          email: profileFormData.email,
          username: profileFormData.username,
        })
        .eq('id', user.id)

      if (error) {
        alert('Error updating profile: ' + error.message)
        return
      }

      // Refresh user session
      await refreshUserSession(user.id)
      const newSession = await refreshUserSession(user.id)
      if (newSession) {
        setUser({
          ...user,
          full_name: newSession.full_name,
          email: newSession.email,
          username: newSession.username,
        })
      }

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    // Validate passwords
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      alert('New passwords do not match')
      return
    }

    if (passwordFormData.new_password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setSaving(true)
    try {
      // Verify current password
      const { data: userData } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', user.id)
        .single()

      if (userData?.password_hash !== passwordFormData.current_password) {
        alert('Current password is incorrect')
        setSaving(false)
        return
      }

      // Update password
      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordFormData.new_password })
        .eq('id', user.id)

      if (error) {
        alert('Error changing password: ' + error.message)
        return
      }

      // Clear password form
      setPasswordFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })

      alert('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('An error occurred while changing password')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBusinessDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !supabase) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: editFormData.name,
          username: editFormData.username,
          location: editFormData.location,
          category: editFormData.category,
          contact: editFormData.contact,
          description: editFormData.description,
          website: editFormData.website,
          openinghours: editFormData.openinghours,
          businesslogo: editFormData.businesslogo,
          businesscover: editFormData.businesscover,
          businessphotos: editFormData.businessphotos,
          facebook: editFormData.facebook,
          instagram: editFormData.instagram,
          twitter: editFormData.twitter,
          tiktok: editFormData.tiktok,
          youtube: editFormData.youtube,
          linkedin: editFormData.linkedin,
          threads: editFormData.threads,
          whatsapp: editFormData.whatsapp,
          googlemapurl: editFormData.googlemapurl,
          brandprimarycolor: editFormData.brandprimarycolor,
          brandsecondarycolor: editFormData.brandsecondarycolor,
        })
        .eq('id', business.id)

      if (error) {
        alert('Error updating business: ' + error.message)
        return
      }

      // Refresh business data
      await fetchOwnerData(business.id)
      setShowEditForm(false)
      alert('Business details updated successfully!')
    } catch (error) {
      console.error('Error saving business:', error)
      alert('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1D33] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Render Owner Dashboard
  if (user && user.business_id !== null) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.full_name?.split(' ')[0] || user.username}!
                </h1>
                <p className="text-gray-600 mt-1">Business Owner Dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menu Items</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMenuItems}</p>
                  <p className="text-sm text-green-600 mt-1">{stats.activeMenuItems} active</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="scale-[2]">
                    <ListIcon />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">WiFi Networks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalWifiNetworks}</p>
                  <p className="text-sm text-gray-500 mt-1">Configured</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18h.01M8.929 14.928c.834-.834 1.963-1.308 3.071-1.308 1.108 0 2.237.474 3.071 1.308m-8.485-3.536c2.259-2.259 5.888-2.259 8.147 0m-11.314-3.536c3.898-3.898 10.243-3.898 14.142 0" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Business Status</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {business?.is_active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{business?.category || 'N/A'}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="scale-[2]">
                    <BusinessIcon />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.businessViews}</p>
                  <p className="text-sm text-gray-500 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="#F97316"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Business Overview */}
          {business && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Business</h2>
              <div className="flex items-start gap-6">
                {business.logo ? (
                  <Image
                    src={business.logo}
                    alt={business.name}
                    width={96}
                    height={96}
                    className="rounded-lg object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="scale-[3]">
                      <BusinessIcon />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{business.name}</h3>
                  <p className="text-gray-600 mt-1">@{business.username}</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {business.category && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4.5A2.5 2.5 0 014.5 2H5.879a2.5 2.5 0 011.767.732l5.622 5.622a2.5 2.5 0 010 3.536l-1.586 1.586a2.5 2.5 0 01-3.536 0L2.732 8.054A2.5 2.5 0 012 6.287V4.5z" stroke="#596D66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="5.5" cy="5.5" r=".5" fill="#596D66"/>
                        </svg>
                        <span>{business.category}</span>
                      </div>
                    )}
                    {business.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 8.667a1.333 1.333 0 100-2.667 1.333 1.333 0 000 2.667z" fill="#596D66"/>
                          <path d="M8 1.333c-2.577 0-4.667 2.09-4.667 4.667 0 3.5 4.667 8.667 4.667 8.667s4.667-5.167 4.667-8.667c0-2.577-2.09-4.667-4.667-4.667z" stroke="#596D66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{business.location}</span>
                      </div>
                    )}
                    {business.contact && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.667 11.28v2a1.333 1.333 0 01-1.454 1.333 13.194 13.194 0 01-5.753-2.046 13 13 0 01-4-4A13.194 13.194 0 011.414 2.787 1.333 1.333 0 012.74 1.333h2A1.333 1.333 0 016.073 2.5c.085.638.242 1.266.467 1.874a1.333 1.333 0 01-.3 1.406l-.847.847a10.667 10.667 0 004 4l.847-.847a1.333 1.333 0 011.406-.3c.608.225 1.236.382 1.874.467a1.333 1.333 0 011.167 1.353z" stroke="#596D66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{business.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {business ? (
                <>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group w-full text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                      <EditIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Edit Business Profile</p>
                      <p className="text-sm text-gray-600">Update business information</p>
                    </div>
                  </button>

                  <Link
                    href="/menu"
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                      <ListIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Menu</p>
                      <p className="text-sm text-gray-600">Add, edit, or remove menu items</p>
                    </div>
                  </Link>

                  <Link
                    href="/wifi"
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 18h.01M8.929 14.928c.834-.834 1.963-1.308 3.071-1.308 1.108 0 2.237.474 3.071 1.308m-8.485-3.536c2.259-2.259 5.888-2.259 8.147 0m-11.314-3.536c3.898-3.898 10.243-3.898 14.142 0" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage WiFi</p>
                      <p className="text-sm text-gray-600">Configure WiFi networks</p>
                    </div>
                  </Link>

                  <Link
                    href={`/${business?.username}`}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="#F97316"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Business Profile</p>
                      <p className="text-sm text-gray-600">See how customers see your business</p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/profile/${user?.username}`}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="#F97316"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View My Profile</p>
                      <p className="text-sm text-gray-600">See your public profile</p>
                    </div>
                  </Link>

                  <Link
                    href="/add-business"
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                      <PlusIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Add Business</p>
                      <p className="text-sm text-gray-600">Register your business on Sliceblaze</p>
                    </div>
                  </Link>
                </>
              )}

              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group w-full text-left"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition">
                  <UserIcon />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Edit Personal Profile</p>
                  <p className="text-sm text-gray-600">Update your account details</p>
                </div>
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
                <p className="text-gray-900 font-medium">{user.full_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
                <p className="text-gray-900 font-medium">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Personal Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Personal Profile</h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Information Form */}
                <form onSubmit={handleSaveProfile}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={profileFormData.full_name}
                        onChange={handleProfileFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={profileFormData.email}
                        onChange={handleProfileFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={profileFormData.username}
                        onChange={handleProfileFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordFormData.current_password}
                        onChange={handlePasswordFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordFormData.new_password}
                        onChange={handlePasswordFormChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordFormData.confirm_password}
                        onChange={handlePasswordFormChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowChangePassword(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Business Details Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Business Details</h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveBusinessDetails} className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <input
                        type="text"
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        name="contact"
                        value={editFormData.contact}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={editFormData.website}
                        onChange={handleEditFormChange}
                        placeholder="https://"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                    <input
                      type="text"
                      name="openinghours"
                      value={editFormData.openinghours}
                      onChange={handleEditFormChange}
                      placeholder="e.g., Mon-Fri: 9AM-5PM"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Images</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo *</label>
                        <CloudinaryUpload
                          currentImageUrl={editFormData.businesslogo}
                          onUploadComplete={(url) => setEditFormData(prev => ({ ...prev, businesslogo: url }))}
                          folder="businesses/logos"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        <CloudinaryUpload
                          currentImageUrl={editFormData.businesscover}
                          onUploadComplete={(url) => setEditFormData(prev => ({ ...prev, businesscover: url }))}
                          folder="businesses/covers"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Photos (Max 10)</label>
                      <div className="space-y-2">
                        {editFormData.businessphotos.map((photo, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Image src={photo} alt={`Photo ${index + 1}`} width={60} height={60} className="rounded object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = editFormData.businessphotos.filter((_, i) => i !== index)
                                setEditFormData(prev => ({ ...prev, businessphotos: newPhotos }))
                              }}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {editFormData.businessphotos.length < 10 && (
                          <CloudinaryUpload
                            currentImageUrl=""
                            onUploadComplete={(url) => {
                              if (editFormData.businessphotos.length < 10) {
                                setEditFormData(prev => ({ ...prev, businessphotos: [...prev.businessphotos, url] }))
                              }
                            }}
                            folder="businesses/photos"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{editFormData.businessphotos.length}/10 photos uploaded</p>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <input
                        type="color"
                        name="brandprimarycolor"
                        value={editFormData.brandprimarycolor}
                        onChange={handleEditFormChange}
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <input
                        type="color"
                        name="brandsecondarycolor"
                        value={editFormData.brandsecondarycolor}
                        onChange={handleEditFormChange}
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                      <input
                        type="url"
                        name="facebook"
                        value={editFormData.facebook}
                        onChange={handleEditFormChange}
                        placeholder="https://facebook.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <input
                        type="url"
                        name="instagram"
                        value={editFormData.instagram}
                        onChange={handleEditFormChange}
                        placeholder="https://instagram.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        name="twitter"
                        value={editFormData.twitter}
                        onChange={handleEditFormChange}
                        placeholder="https://twitter.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                      <input
                        type="url"
                        name="tiktok"
                        value={editFormData.tiktok}
                        onChange={handleEditFormChange}
                        placeholder="https://tiktok.com/@..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                      <input
                        type="url"
                        name="youtube"
                        value={editFormData.youtube}
                        onChange={handleEditFormChange}
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={editFormData.linkedin}
                        onChange={handleEditFormChange}
                        placeholder="https://linkedin.com/company/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Threads</label>
                      <input
                        type="url"
                        name="threads"
                        value={editFormData.threads}
                        onChange={handleEditFormChange}
                        placeholder="https://threads.net/@..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={editFormData.whatsapp}
                        onChange={handleEditFormChange}
                        placeholder="+1234567890"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
                      <input
                        type="url"
                        name="googlemapurl"
                        value={editFormData.googlemapurl}
                        onChange={handleEditFormChange}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    disabled={saving}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render Normal User Dashboard
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.full_name?.split(' ')[0] || user.username}!
              </h1>
              <p className="text-gray-600 mt-1">Ready to start your business journey?</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-linear-to-br from-[#ED1D33] to-red-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Get Started with SliceBlaze!</h2>
          <p className="text-red-100 mb-6">
            Create your business profile and start connecting with customers today.
          </p>
          <Link
            href="/add-business"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#ED1D33] rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4v12m-6-6h12" stroke="#ED1D33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Your Business
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="scale-[2]">
                <BusinessIcon />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Business Profile</h3>
            <p className="text-gray-600 text-sm">
              Create a professional profile for your business with photos, details, and contact information.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <div className="scale-[2]">
                <ListIcon />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Menu</h3>
            <p className="text-gray-600 text-sm">
              Share your menu online with beautiful formatting, prices, and item descriptions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18h.01M8.929 14.928c.834-.834 1.963-1.308 3.071-1.308 1.108 0 2.237.474 3.071 1.308m-8.485-3.536c2.259-2.259 5.888-2.259 8.147 0m-11.314-3.536c3.898-3.898 10.243-3.898 14.142 0" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">WiFi Sharing</h3>
            <p className="text-gray-600 text-sm">
              Let customers easily connect to your WiFi with QR codes and password sharing.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/add-business"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <div className="scale-[1.5]">
                  <BusinessIcon />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Create Business</p>
                <p className="text-sm text-gray-600">Set up your business profile</p>
              </div>
            </Link>

            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group w-full text-left"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <UserIcon />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </div>
            </button>

            <Link
              href="/search"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                <div className="scale-[1.2]">
                  <SearchIcon />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Explore Businesses</p>
                <p className="text-sm text-gray-600">Find local businesses</p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#ED1D33] hover:bg-red-50 transition group"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                <ContactIcon />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Contact Support</p>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
              <p className="text-gray-900 font-medium">{user.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Username</p>
              <p className="text-gray-900 font-medium">@{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
