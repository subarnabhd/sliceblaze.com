"use client"

type PaymentMethod = 'Fonepay' | 'Nepalpay' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer';

interface BusinessProfile {
  id: number;
  username: string;
  name: string;
  address?: string;
  category?: string;
  business_logo?: string;
  description?: string;
  mobile?: string;
  opening_hours?: string;
  closing_hour?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  google_map_url?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  created_at?: string;
  is_active?: boolean;
  whatsapp?: string;
  website?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  threads?: string;
  business_cover?: string;
  business_photos?: string[];
  pan_number?: string;
  employees?: number;
  country?: string;
  district?: string;
  city?: string;
  payment_methods?: string[];
  established_date?: string;
  phone?: string;
  email?: string;
}

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBusinessByUsername, getBusinessWifi, getFullMenu } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import WifiConnect from '@/components/WifiConnect'
import MenuDisplay from '@/components/MenuDisplay'
import { generateBusinessJsonLd } from '@/lib/json-ld'

interface Business {
  id: number;
  username: string;
  name: string;
  address?: string;
  category?: string;
  business_logo?: string;
  description?: string;
  mobile?: string;
  opening_hours?: string;
  closing_hour?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  google_map_url?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  created_at?: string;
  is_active?: boolean;
  whatsapp?: string;
  website?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  threads?: string;
  business_cover?: string;
  business_photos?: string[];
  pan_number?: string;
  employees?: number;
  country?: string;
  district?: string;
  city?: string;
  payment_methods?: string[];
  established_date?: string;
  phone?: string;
  email?: string;
}

interface WifiNetwork {
  id: number
  ssid: string
  password: string
  security_type: string
  is_hidden: boolean
}

interface MenuCategory {
  id: number
  name: string
  display_order: number
  is_active: boolean
  menu_subcategories: MenuSubcategory[]
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image?: string
  is_active: boolean
  display_order: number
}

interface MenuSubcategory {
  id: number
  name: string
  display_order: number
  is_active: boolean
  menu_items: MenuItem[]
}

export default function BusinessProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [business, setBusiness] = useState<Business | null>(null)
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([])
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  // const [imgSrc, setImgSrc] = useState('/sample.svg')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${business?.username}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    async function fetchBusiness() {
      if (username) {
        const data = await getBusinessByUsername(username)
          
          // Fetch menu for the business
          const menuData = await getFullMenu(data.id)
          setMenu(menuData)
        console.log('Fetched business data:', data) // Debug log
        setBusiness(data)
        // Use new field name with fallback to old
        // (imgSrc logic removed)
        // Fetch WiFi networks for the business
        if (data?.id) {
          const wifi = await getBusinessWifi(data.id)
          setWifiNetworks(wifi)
        }
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [username])

  // Helper functions to get values with fallback to old field names
  const getAddress = () => business?.address || ''
  const getPhone = () => business?.phone || ''
  const getLogoUrl = () => business?.business_logo || '/sample.svg'
  const getOpeningHours = () => business?.opening_hours || ''
  const getFacebookUrl = () => business?.facebook || ''
  const getInstagramUrl = () => business?.instagram || ''
  const getTwitterUrl = () => business?.twitter || ''
  const getPrimaryColor = () => business?.brand_primary_color || '#ED1D33'

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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Business Not Found</h1>
          <p className="text-gray-600 mb-6">The business you are looking for does not exist.</p>
          <Link href="/" className="px-6 py-3 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828]">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* JSON-LD Structured Data */}
      {business && generateBusinessJsonLd(business)}

      <div className="container mx-auto px-4">
        {/* Business Header */}
        <div
          className="rounded-2xl border border-gray-200 bg-white/70 drop-shadow-xl backdrop-blur-lg transition-all duration-500 ease-in-out overflow-hidden mb-6"
          style={{
            borderTop: `4px solid ${getPrimaryColor()}`,
          }}
        >
          <div className="p-4 md:p-6 lg:p-8 bg-white">
            <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
              <div className="shrink-0">
                <Image
                  src={getLogoUrl()}
                  alt={`${business.name} logo - ${business.category} in ${getAddress()}`}
                  title={`${business.name} - ${business.category}`}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                  itemProp="image"
                  loading="eager"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/sample.svg";
                  }}
                />
              </div>
              <div className="flex-1 w-full">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {business.name}
                </h1>
                <div className="flex items-center gap-2 my-2">
                  <p
                    className="text-sm  px-3 py-1 rounded-full inline-block"
                    style={{
                      color: getPrimaryColor(),
                      backgroundColor: `${getPrimaryColor()}20`,
                    }}
                  >
                    @{business.username}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group relative"
                    title="Copy profile link"
                  >
                    {copied ? (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-lg text-gray-600 mb-1">
                  {business.category}
                </p>
                {business.google_map_url ? (
                  <a
                    href={business.google_map_url?.replace("/embed", "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#ED1D33] flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {getAddress()}
                  </a>
                ) : (
                  <p className="text-gray-500 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {getAddress()}
                  </p>
                )}
              </div>
            </div>

            {business.description && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                {business.description}
              </p>
            )}

            {/* Business Photos Gallery */}
            {business.business_photos && business.business_photos.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {business.business_photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={photo}
                        alt={`${business.name} - Photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              {getPhone() && (
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-700">{getPhone()}</span>
                </div>
              )}
              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-green-600 hover:text-green-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              )}
              {business.website && (
                <a
                  href={
                    business.website.startsWith("http")
                      ? business.website
                      : `https://${business.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 break-all"
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  {business.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              )}
              {business.google_map_url && (
                <a
                  href={business.google_map_url?.replace("/embed", "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#ED1D33] hover:text-[#C91828]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  View on Google Maps
                </a>
              )}
              {getOpeningHours() && (
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{getOpeningHours()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <div className="space-y-3">
              {getFacebookUrl() && (
                <a
                  href={getFacebookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
              {getInstagramUrl() && (
                <a
                  href={getInstagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-pink-600 hover:text-pink-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
              )}
              {business.tiktok && (
                <a
                  href={business.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-800 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                  TikTok
                </a>
              )}
              {getTwitterUrl() && (
                <a
                  href={getTwitterUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </a>
              )}
              {business.youtube && (
                <a
                  href={business.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-red-600 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
              )}
              {business.linkedin && (
                <a
                  href={business.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-700 hover:text-blue-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {business.threads && (
                <a
                  href={business.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-900 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.956 1.191-2.352 1.796-4.15 1.796-1.747 0-3.234-.586-4.42-1.741-1.197-1.165-1.803-2.789-1.803-4.83s.606-3.665 1.803-4.83c1.186-1.155 2.673-1.741 4.42-1.741 1.798 0 3.194.605 4.15 1.796.662.826 1.092 1.92 1.284 3.272.761-.45 1.324-1.04 1.634-1.75.528-1.205.557-3.185-1.09-4.798-1.442-1.414-3.177-2.025-5.8-2.045z" />
                  </svg>
                  Threads
                </a>
              )}
             
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social Links */}
        </div>

        {/* WiFi Networks */}
        {wifiNetworks && wifiNetworks.length > 0 && (
          <div className="mt-4 md:mt-6">
            <WifiConnect
              wifiNetworks={wifiNetworks}
              brandColor={
                business.brand_primary_color ||
                business.brand_primary_color ||
                "#ED1D33"
              }
            />
          </div>
        )}

        {/* Menu Display */}
        {menu && menu.length > 0 && (
          <div className="mt-4 md:mt-6">
            <MenuDisplay
              menu={menu}
              brandColor={
                business.brand_primary_color ||
                business.brand_primary_color ||
                "#ED1D33"
              }
              currencySymbol="$"
            />
          </div>
        )}

        
      </div>
    </div>
  );
}
