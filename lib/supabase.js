import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This will now work because 'supabaseAnonKey' is no longer undefined
export const supabase = createClient(supabaseUrl, supabaseAnonKey)