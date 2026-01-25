import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both env vars are present
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Function to fetch all businesses
export async function getBusinesses() {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return data || []
}

// Function to fetch a single business by username
export async function getBusinessByUsername(username) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  
  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data
}

// Function to fetch business by ID
export async function getBusinessById(id) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single()

  
  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data
}

// Function to create a new business
export async function createBusiness(businessData) {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  console.log('Creating business with data:', businessData)

  // Map camelCase to lowercase field names to match database schema
  const dataToInsert = {
    name: businessData.name,
    username: businessData.username,
    location: businessData.location || '',
    category: businessData.category || '',
    image: businessData.image || '/sample.svg',
    description: businessData.description || '',
    contact: businessData.contact || '',
    openinghours: businessData.openingHours || businessData.openinghours || '',
    facebook: businessData.facebook || '',
    instagram: businessData.instagram || '',
    tiktok: businessData.tiktok || '',
    googlemapurl: businessData.googleMapUrl || businessData.googlemapurl || '',
    direction: businessData.direction || '',
    menuurl: businessData.menuUrl || businessData.menuurl || '',
    wifiqrcode: businessData.wifiQrCode || businessData.wifiqrcode || '',
    brandprimarycolor: businessData.brandPrimaryColor || businessData.brandprimarycolor || '',
    brandsecondarycolor: businessData.brandSecondaryColor || businessData.brandsecondarycolor || '',
    is_active: businessData.is_active !== false,
  }

  console.log('Data to insert:', dataToInsert)

  const { data, error } = await supabase
    .from('businesses')
    .insert([dataToInsert])
    .select()
    .single()

  if (error) {
    console.error('Error creating business:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error details:', error.details)
    console.error('Error hint:', error.hint)
    if (error.message) {
      console.error('Full error message:', error.message)
    }
    return null
  }

  console.log('Business created successfully:', data)
  return data
}

// Function to update business details
export async function updateBusiness(businessId, updates) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', businessId)
    .select()
    .single()

  
  if (error) {
    console.error('Error updating business:', error)
    return null
  }

  return data
}

// Function to get user with business details
export async function getUserBusiness(userId) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .select('id, business_id, username, businesses(*)')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user business:', error)
    return null
  }

  return data
}

// Admin function to get all businesses
export async function getAllBusinessesAdmin() {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*, users(username, email, full_name)')
    .order('name')
  
  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return data || []
}

// Admin functions

// Get all users with their business details
export async function getAllUsers() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, full_name, role, business_id, is_active, created_at, businesses(name)')
    .order('created_at', { ascending: false })

  
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data || []
}

// Create a new user
export async function createUser(userData) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data
}

// Update user
export async function updateUser(userId, updates) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return null
  }

  return data
}

// Delete user
export async function deleteUser(userId) {
  if (!supabase) return false

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    return false
  }

  return true
}

// Additional functions like createUser, updateUser, deleteUser, getUserBusiness can be added here as needed.

// ============= WiFi Management Functions =============

// Get all WiFi networks for a business
export async function getBusinessWifi(businessId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('business_wifi')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching business WiFi:', error)
    return []
  }

  return data || []
}

// Add a new WiFi network for a business
export async function addBusinessWifi(wifiData) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('business_wifi')
    .insert([wifiData])
    .select()
    .single()

  if (error) {
    console.error('Error adding WiFi network:', error)
    return null
  }

  return data
}

// Update a WiFi network
export async function updateBusinessWifi(wifiId, updates) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('business_wifi')
    .update(updates)
    .eq('id', wifiId)
    .select()
    .single()

  if (error) {
    console.error('Error updating WiFi network:', error)
    return null
  }

  return data
}

// Delete a WiFi network
export async function deleteBusinessWifi(wifiId) {
  if (!supabase) return false

  const { error } = await supabase
    .from('business_wifi')
    .delete()
    .eq('id', wifiId)

  if (error) {
    console.error('Error deleting WiFi network:', error)
    return false
  }

  return true
}

// ============= Menu Management Functions =============

// ===== CATEGORY Functions =====

// Get all menu categories for a business
export async function getMenuCategories(businessId) {
  if (!supabase) {
    console.error('Error fetching menu categories: Supabase client not initialized')
    return []
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('business_id', businessId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching menu categories:', error.message || error)
    return []
  }

  return data || []
}

// Get full menu with categories, subcategories, and items
export async function getFullMenu(businessId) {
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select(`
        *,
        menu_subcategories (
          *,
          menu_items (*)
        )
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      // Table might not exist yet - silently return empty array
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return []
      }
      console.error('Error fetching full menu:', error)
      return []
    }

    return data || []
  } catch (err) {
    // Catch any unexpected errors
    console.error('Unexpected error fetching menu:', err)
    return []
  }
}

// Add a new menu category
export async function addMenuCategory(categoryData) {
  if (!supabase) {
    console.error('Error adding menu category: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .insert([categoryData])
    .select()
    .single()

  if (error) {
    console.error('Error adding menu category:', error.message || error)
    return null
  }

  return data
}

// Update a menu category
export async function updateMenuCategory(categoryId, updates) {
  if (!supabase) {
    console.error('Error updating menu category: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single()

  if (error) {
    console.error('Error updating menu category:', error.message || error)
    return null
  }

  return data
}

// Delete a menu category
export async function deleteMenuCategory(categoryId) {
  if (!supabase) {
    console.error('Error deleting menu category: Supabase client not initialized')
    return false
  }

  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    console.error('Error deleting menu category:', error.message || error)
    return false
  }

  return true
}

// ===== SUBCATEGORY Functions =====

// Get all subcategories for a category
export async function getMenuSubcategories(categoryId) {
  if (!supabase) {
    console.error('Error fetching menu subcategories: Supabase client not initialized')
    return []
  }

  const { data, error } = await supabase
    .from('menu_subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching menu subcategories:', error.message || error)
    return []
  }

  return data || []
}

// Add a new menu subcategory
export async function addMenuSubcategory(subcategoryData) {
  if (!supabase) {
    console.error('Error adding menu subcategory: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_subcategories')
    .insert([subcategoryData])
    .select()
    .single()

  if (error) {
    console.error('Error adding menu subcategory:', error.message || error)
    return null
  }

  return data
}

// Update a menu subcategory
export async function updateMenuSubcategory(subcategoryId, updates) {
  if (!supabase) {
    console.error('Error updating menu subcategory: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_subcategories')
    .update(updates)
    .eq('id', subcategoryId)
    .select()
    .single()

  if (error) {
    console.error('Error updating menu subcategory:', error.message || error)
    return null
  }

  return data
}

// Delete a menu subcategory
export async function deleteMenuSubcategory(subcategoryId) {
  if (!supabase) {
    console.error('Error deleting menu subcategory: Supabase client not initialized')
    return false
  }

  const { error } = await supabase
    .from('menu_subcategories')
    .delete()
    .eq('id', subcategoryId)

  if (error) {
    console.error('Error deleting menu subcategory:', error.message || error)
    return false
  }

  return true
}

// ===== ITEM Functions =====

// Get all items for a subcategory
export async function getMenuItems(subcategoryId) {
  if (!supabase) {
    console.error('Error fetching menu items: Supabase client not initialized')
    return []
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('subcategory_id', subcategoryId)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching menu items:', error.message || error)
    return []
  }

  return data || []
}

// Add a new menu item
export async function addMenuItem(itemData) {
  if (!supabase) {
    console.error('Error adding menu item: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert([itemData])
    .select()
    .single()

  if (error) {
    console.error('Error adding menu item:', error.message || error)
    return null
  }

  return data
}

// Update a menu item
export async function updateMenuItem(itemId, updates) {
  if (!supabase) {
    console.error('Error updating menu item: Supabase client not initialized')
    return null
  }

  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()

  if (error) {
    console.error('Error updating menu item:', error.message || error)
    return null
  }

  return data
}

// Delete a menu item
export async function deleteMenuItem(itemId) {
  if (!supabase) {
    console.error('Error deleting menu item: Supabase client not initialized')
    return false
  }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error deleting menu item:', error.message || error)
    return false
  }

  return true
}