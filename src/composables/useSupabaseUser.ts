import { ref, onMounted, onUnmounted } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface SupabaseUser {
  user: User | null
  session: {
    access_token: string
  } | null
}

export function useSupabaseUser() {
  const user = ref<SupabaseUser | null>(null)

  async function getUser() {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (error || sessionError) {
      console.error('Error fetching user:', error || sessionError)
      user.value = null
      return
    }

    if (supabaseUser && session) {
      user.value = {
        user: supabaseUser,
        session
      }
    } else {
      user.value = null
    }
  }

  onMounted(() => {
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        user.value = {
          user: session.user,
          session
        }
      } else {
        user.value = null
      }
    })

    onUnmounted(() => {
      subscription.unsubscribe()
    })
  })

  return user
} 