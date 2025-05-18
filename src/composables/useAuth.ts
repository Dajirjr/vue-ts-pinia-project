import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useToast } from './useToast'
import type { Session } from '@supabase/supabase-js'

interface SessionState {
  session: Session | null
  loading: boolean
  error: Error | null
}

export function useAuth() {
  const router = useRouter()
  const toast = useToast()
  const sessionState = ref<SessionState>({
    session: null,
    loading: true,
    error: null
  })
  const sessionExpiryWarningShown = ref(false)
  const refreshAttempts = ref(0)
  const MAX_REFRESH_ATTEMPTS = 3
  const REFRESH_RETRY_DELAY = 1000 // 1 second

  // Check session expiry every minute
  const checkSessionExpiry = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const expiresAt = new Date(session.expires_at! * 1000)
    const now = new Date()
    const minutesUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / 1000 / 60)

    // Try to refresh 10 minutes before expiry
    if (minutesUntilExpiry <= 10) {
      await refreshSession()
      return
    }

    // Show warning 5 minutes before expiry
    if (minutesUntilExpiry <= 5 && !sessionExpiryWarningShown.value) {
      sessionExpiryWarningShown.value = true
      toast.warning('Your session will expire soon. Please save your work.')
    }

    // Force logout if session expired
    if (minutesUntilExpiry <= 0) {
      handleSessionExpired()
    }
  }

  const refreshSession = async () => {
    if (sessionState.value.loading) return

    sessionState.value.loading = true
    sessionState.value.error = null

    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      sessionState.value.session = data.session
      sessionExpiryWarningShown.value = false
      refreshAttempts.value = 0
      toast.success('Session refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh session:', error)
      sessionState.value.error = error as Error
      
      // Implement retry mechanism
      if (refreshAttempts.value < MAX_REFRESH_ATTEMPTS) {
        refreshAttempts.value++
        setTimeout(async () => {
          await refreshSession()
        }, REFRESH_RETRY_DELAY * refreshAttempts.value)
      } else {
        toast.error('Failed to refresh session. Please log in again.')
        handleSessionExpired()
      }
    } finally {
      sessionState.value.loading = false
    }
  }

  const handleSessionExpired = () => {
    supabase.auth.signOut()
    sessionState.value.session = null
    sessionState.value.error = null
    sessionState.value.loading = false
    toast.error('Your session has expired. Please log in again.')
    router.push('/login')
  }

  // Set up session monitoring
  let sessionCheckInterval: ReturnType<typeof setInterval>

  onMounted(async () => {
    // Initial session setup
    const { data: { session } } = await supabase.auth.getSession()
    sessionState.value = {
      session,
      loading: false,
      error: null
    }

    // Initial session check
    await checkSessionExpiry()

    // Set up periodic checks
    sessionCheckInterval = setInterval(checkSessionExpiry, 60000) // Check every minute

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        handleSessionExpired()
      } else if (event === 'SIGNED_IN') {
        sessionState.value.session = session
        sessionExpiryWarningShown.value = false
      }
    })
  })

  onUnmounted(() => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval)
    }
  })

  return {
    sessionState,
    refreshSession,
    handleSessionExpired
  }
} 