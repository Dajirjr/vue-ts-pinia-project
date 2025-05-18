import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useSupabase() {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Initialize user on mount
  const initUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      user.value = currentUser;
    } catch (err) {
      console.error('Error getting user:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      user.value = data.user;
      
      return data;
    } catch (err) {
      console.error('Error signing in:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      user.value = data.user;
      
      return data;
    } catch (err) {
      console.error('Error signing up:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      
      user.value = null;
    } catch (err) {
      console.error('Error signing out:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email);
      if (authError) throw authError;
    } catch (err) {
      console.error('Error resetting password:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    initUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
} 