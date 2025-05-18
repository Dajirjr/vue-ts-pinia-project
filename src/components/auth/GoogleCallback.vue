<!-- Google OAuth Callback Component -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="p-6 text-center">
      <div v-if="error" class="text-red-600">
        {{ error }}
      </div>
      <div v-else class="space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p>Authenticating with Google...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGoogleAccessTokenFromUrl, getGoogleUserInfo } from '@/lib/integrations/google-auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const token = getGoogleAccessTokenFromUrl()
    
    if (!token) {
      throw new Error('No access token found in URL')
    }

    // Get user info to verify the token
    const userInfo = await getGoogleUserInfo(token)
    
    // Store the token and user email
    authStore.setGoogleAuth({
      token,
      email: userInfo.email
    })

    // Redirect to settings page
    router.push('/settings')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed'
    // Redirect to settings page after 3 seconds even if there's an error
    setTimeout(() => router.push('/settings'), 3000)
  }
})
</script> 