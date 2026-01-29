import { useEffect } from 'react';
import { supabase } from './supabase';
import { setUserSession } from './auth';

export function useSupabaseAuthEffect() {
  useEffect(() => {
    const getSessionAndSync = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        // Check if user exists in your users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (!userData) {
          // Create user in your users table
          await supabase.from('users').insert([
            {
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.email,
              username: data.user.email.split('@')[0],
              role: 'user',
              is_active: true,
            },
          ]);
        }

        // Optionally, fetch the user again to get the ID and set session
        const { data: newUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (newUser) {
          setUserSession({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            full_name: newUser.full_name,
            role: newUser.role,
            business_id: newUser.business_id,
            is_active: newUser.is_active,
          });
        }
      }
    };

    getSessionAndSync();
  }, []);
}
