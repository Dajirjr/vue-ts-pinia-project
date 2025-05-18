import { defineStore } from 'pinia'
import { signInWithGoogle } from '@/lib/integrations/google-auth'
import { storeGoogleToken } from '@/lib/integrations/calendar-sync'
import { useSupabaseUser } from '@/composables/useSupabaseUser'

interface GoogleAuth {
  token: string
  email: string
  expiresAt?: number
}

interface AuthState {
  googleToken: string | null
  googleEmail: string | null
  googleTokenExpiresAt: number | null
  selectedCalendarId: string
}

export const useAuthStore = defineStore({
  id: 'auth',
  
  state: (): AuthState => ({
    googleToken: null,
    googleEmail: null,
    googleTokenExpiresAt: null,
    selectedCalendarId: 'primary'
  }),

  getters: {
    isGoogleTokenExpired(state: AuthState): boolean {
      if (!state.googleTokenExpiresAt) return true
      // Consider token expired 5 minutes before actual expiry
      return Date.now() > (state.googleTokenExpiresAt - 5 * 60 * 1000)
    }
  },

  actions: {
    async setGoogleAuth({ token, email, expiresAt }: GoogleAuth) {
      this.googleToken = token
      this.googleEmail = email
      this.googleTokenExpiresAt = expiresAt || null

      // Store token in Supabase if user is authenticated
      const user = useSupabaseUser()
      if (user.value && expiresAt) {
        try {
          await storeGoogleToken(
            token,
            Math.floor((expiresAt - Date.now()) / 1000),
            user.value.session?.access_token || ''
          )
        } catch (error) {
          console.error('Failed to persist Google token:', error)
        }
      }
    },

    clearGoogleAuth() {
      this.googleToken = null
      this.googleEmail = null
      this.googleTokenExpiresAt = null
    },

    async refreshGoogleAuthIfNeeded() {
      if (this.googleToken && this.$state.googleTokenExpiresAt) {
        const expiresAt = this.$state.googleTokenExpiresAt
        if (Date.now() > (expiresAt - 5 * 60 * 1000)) {
          await signInWithGoogle()
        }
      }
    },

    setSelectedCalendar(calendarId: string) {
      this.selectedCalendarId = calendarId
    }
  }
}) 