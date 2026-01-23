import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both env vars are present
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Debug function to check all users in database
export async function debugGetAllUsers() {
  if (!supabase) return []
  
  try {
    // Try to get all data without specifying columns
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching all users:', error)
      return []
    }
    
    console.log('All users in database:', data)
    console.log('First user structure:', data && data[0] ? Object.keys(data[0]) : 'No users found')
    return data || []
  } catch (err) {
    console.error('Debug error:', err)
    return []
  }
}

// Debug function to check user by email (alternative authentication)
export async function debugGetUserByEmail(email) {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
    
    console.log('User found by email:', data)
    return data
  } catch (err) {
    console.error('Debug error:', err)
    return null
  }
}

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

// Function to verify login credentials and get user info
export async function verifyLogin(username, password) {
  if (!supabase) {
    console.error('Supabase not initialized')
    return null
  }

  try {
    console.log('Attempting login with username:', username)
    
    // Try to get user - first without lowercase to check if that's the issue
    // Try to get user
    const { data, error } = await supabase
      .from('users')
      .select('id, business_id, username, email, role, full_name, is_active, password_hash')
      .eq('username', username)
      .eq('is_active', true)
      .single()
      .maybeSingle()

    if (error) {
      console.error('User lookup error:', error)
      console.log('Trying with lowercase...')
      
      console.error('User lookup error:', JSON.stringify(error, null, 2))
      return null
    }

    if (!data) {
      // Try with lowercase as fallback
      const { data: data2, error: error2 } = await supabase
        .from('users')
        .select('id, business_id, username, email, role, full_name, is_active, password_hash')
        .eq('username', username.toLowerCase())
        .eq('is_active', true)
        .single()
      
        .maybeSingle()

      if (error2) {
        console.error('Lowercase lookup also failed:', error2)
        console.error('Lowercase lookup failed:', JSON.stringify(error2, null, 2))
        return null
      }
      

      if (!data2) {
        console.log('User not found with lowercase:', username.toLowerCase())
        return null
      }

      // Verify password
      if (data2.password_hash !== password) {
        console.log('Password mismatch. DB hash:', data2.password_hash, 'Input:', password)
        return null
      }

      return {
        id: data2.id,
        business_id: data2.business_id,
        username: data2.username,
        email: data2.email,
        role: data2.role,
        full_name: data2.full_name,
        is_active: data2.is_active,
        is_active: data2.is_active
      }
    }

    if (!data) {
      console.log('User not found:', username)
      return null
    }

    // Verify password
    console.log('Comparing passwords:')
    console.log('  DB password_hash:', data.password_hash)
    console.log('  Input password:', password)
    console.log('  Match:', data.password_hash === password)
    
    if (data.password_hash !== password) {
      console.log('Password mismatch for user:', username)
      return null
    }

    // Return user data without password hash
    console.log('Login successful for user:', username)
    return {
      id: data.id,
      business_id: data.business_id,
      username: data.username,
      email: data.email,
      role: data.role,
      full_name: data.full_name,
      is_active: data.is_active,
      is_active: data.is_active
    }
  } catch (err) {
    console.error('Login error:', err)
    return null
  }
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