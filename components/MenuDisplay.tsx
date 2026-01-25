'use client'

import { useState } from 'react'
import Image from 'next/image'

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

interface MenuCategory {
  id: number
  name: string
  display_order: number
  is_active: boolean
  menu_subcategories: MenuSubcategory[]
}

interface MenuDisplayProps {
  menu: MenuCategory[]
  brandColor?: string
  currencySymbol?: string
}

export default function MenuDisplay({ menu, brandColor = '#ED1D33', currencySymbol = 'Rs.' }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(
    menu.length > 0 ? menu[0].id : null
  )

  if (!menu || menu.length === 0) {
    return null
  }

  const activeCategoryData = menu.find(cat => cat.id === activeCategory)

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Menu</h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {menu.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === category.id
                ? 'text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
            style={
              activeCategory === category.id
                ? { backgroundColor: brandColor }
                : {}
            }
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Content */}
      {activeCategoryData && (
        <div className="space-y-8">
          {activeCategoryData.menu_subcategories
            ?.filter(sub => sub.is_active)
            .sort((a, b) => a.display_order - b.display_order)
            .map((subcategory) => (
              <div key={subcategory.id}>
                <h3 
                  className="text-xl font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: brandColor }}
                >
                  {subcategory.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subcategory.menu_items
                    ?.filter(item => item.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        {item.image && (
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {item.name}
                            </h4>
                            <span 
                              className="font-bold text-lg whitespace-nowrap"
                              style={{ color: brandColor }}
                            >
                              {currencySymbol}{Math.floor(item.price)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Empty State */}
      {activeCategoryData && 
       (!activeCategoryData.menu_subcategories || 
        activeCategoryData.menu_subcategories.length === 0) && (
        <div className="text-center py-12">
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
          <p className="text-gray-500">No items in this category yet</p>
        </div>
      )}
    </div>
  )
}
