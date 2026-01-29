/**
 * Sign in or sign up with Google using Supabase OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) return { error: 'Supabase not initialized' };
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
import { supabase } from './supabase'

export interface UserSession {
  id: number
  username: string
  email: string
  full_name: string
  role: 'admin' | 'owner' | 'user'
  business_id: number | null
  is_active: boolean
}

/**
 * Get the current user session from localStorage
 */
export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null
  
  const session = localStorage.getItem('userSession')
  if (!session) return null
  
  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

/**
 * Set the user session in localStorage
 */
export function setUserSession(session: UserSession): void {
  localStorage.setItem('userSession', JSON.stringify(session))
}

/**
 * Clear the user session
 */
export function clearUserSession(): void {
  localStorage.removeItem('userSession')
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getUserSession() !== null
}

/**
 * Check if user is an owner (has a business)
 */
export function isOwner(session?: UserSession | null): boolean {
  const userSession = session || getUserSession()
  return userSession !== null && userSession.business_id !== null
}

/**
 * Check if user is a normal user (no business)
 */
export function isNormalUser(session?: UserSession | null): boolean {
  const userSession = session || getUserSession()
  return userSession !== null && userSession.business_id === null && userSession.role !== 'admin'
}

/**
 * Check if user is an admin
 */
export function isAdmin(session?: UserSession | null): boolean {
  const userSession = session || getUserSession()
  return userSession !== null && userSession.role === 'admin'
}

/**
 * Get user's business ID
 */
export function getUserBusinessId(session?: UserSession | null): number | null {
  const userSession = session || getUserSession()
  return userSession?.business_id || null
}

/**
 * Fetch user data from database and update session
 */
export async function refreshUserSession(userId: number): Promise<UserSession | null> {
  if (!supabase) return null

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, business_id, is_active')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    const session: UserSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      role: user.role || 'user',
      business_id: user.business_id,
      is_active: user.is_active
    }

    setUserSession(session)
    return session
  } catch (error) {
    console.error('Error refreshing user session:', error)
    return null
  }
}

/**
 * Validate login credentials and return user session
 */
export async function login(username: string, password: string): Promise<{
  success: boolean
  session?: UserSession
  error?: string
}> {
  if (!supabase) {
    return { success: false, error: 'Database connection error' }
  }

  try {
    // Check if user exists
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (queryError || !user) {
      return { success: false, error: 'Invalid username or password' }
    }

    // Check password
    if (user.password_hash !== password) {
      return { success: false, error: 'Invalid username or password' }
    }

    // Check if account is active
    if (!user.is_active) {
      return { success: false, error: 'Account is inactive. Please contact support.' }
    }

    // Create session object
    const session: UserSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      role: user.role || 'user',
      business_id: user.business_id,
      is_active: user.is_active
    }

    setUserSession(session)

    return { success: true, session }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

/**
 * Logout the current user
 */
export function logout(): void {
  clearUserSession()
}

/**
 * Get user role display name
 */
export function getUserRoleDisplay(session?: UserSession | null): string {
  const userSession = session || getUserSession()
  if (!userSession) return 'Guest'
  
  if (isAdmin(userSession)) return 'Admin'
  if (isOwner(userSession)) return 'Business Owner'
  return 'User'
}

/**
 * Check if user can manage a specific business
 */
export async function canManageBusiness(businessId: number, session?: UserSession | null): Promise<boolean> {
  const userSession = session || getUserSession()
  if (!userSession) return false
  
  // Admins can manage all businesses
  if (isAdmin(userSession)) return true
  
  // Owners can only manage their own business
  return userSession.business_id === businessId
}
