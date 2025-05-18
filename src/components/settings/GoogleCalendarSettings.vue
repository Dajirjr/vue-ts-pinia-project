<!-- Google Calendar Settings Component -->
<template>
  <div class="p-4 rounded-lg border border-gray-200 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Google Calendar Sync</h2>
      <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Not Connected State -->
    <div v-if="!isConnected" class="space-y-3">
      <p class="text-sm text-gray-600">
        Connect your Google Calendar to automatically sync your tasks with your calendar.
      </p>
      <button
        @click="handleConnect"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c6.616 0 12-5.383 12-12S18.616 0 12 0zm0 2c5.535 0 10 4.465 10 10s-4.465 10-10 10S2 17.535 2 12 6.465 2 12 2zm-.5 4v5.5H6v1h5.5V18h1v-5.5H18v-1h-5.5V6h-1z"/>
        </svg>
        Connect Google Calendar
      </button>
    </div>

    <!-- Connected State -->
    <div v-else class="space-y-3">
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Connected
        </span>
        <span class="text-sm text-gray-600">as {{ userEmail }}</span>
      </div>

      <div class="space-y-2">
        <button
          @click="handleSync"
          :disabled="isLoading"
          class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Sync Tasks Now
        </button>
        <button
          @click="handleDisconnect"
          :disabled="isLoading"
          class="block text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          Disconnect
        </button>
      </div>

      <div class="text-xs text-gray-500 space-y-1">
        <p v-if="lastSyncTime">
          Last synced: {{ new Date(lastSyncTime).toLocaleString() }}
        </p>
        <p>
          {{ syncStats.total }} tasks synced
          <span v-if="syncStats.errors" class="text-red-600">
            ({{ syncStats.errors }} failed)
          </span>
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { signInWithGoogle } from '@/lib/integrations/google-auth'
import { 
  createGoogleEvent, 
  fetchGoogleCalendarEvents,
  updateGoogleEvent,
  isTaskSynced,
  getEventIdForTask
} from '@/lib/integrations/calendar-sync'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const isLoading = ref(false)
const error = ref<string | null>(null)
const lastSyncTime = ref<string | null>(null)
const syncStats = ref({
  total: 0,
  errors: 0
})

const isConnected = computed(() => !!authStore.googleToken)
const userEmail = computed(() => authStore.googleEmail)

onMounted(async () => {
  if (isConnected.value) {
    await authStore.refreshGoogleAuthIfNeeded()
  }
})

async function handleConnect() {
  try {
    error.value = null
    await signInWithGoogle()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to connect to Google Calendar'
  }
}

async function handleDisconnect() {
  try {
    authStore.clearGoogleAuth()
    error.value = null
    lastSyncTime.value = null
    syncStats.value = { total: 0, errors: 0 }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to disconnect Google Calendar'
  }
}

async function handleSync() {
  if (!authStore.googleToken) return

  isLoading.value = true
  error.value = null
  syncStats.value = { total: 0, errors: 0 }

  try {
    // Refresh token if needed
    await authStore.refreshGoogleAuthIfNeeded()
    if (!authStore.googleToken) {
      throw new Error('Authentication required')
    }

    // Get all calendar events first
    const events = await fetchGoogleCalendarEvents(authStore.googleToken)
    
    // Get incomplete tasks with due dates
    const tasks = taskStore.tasks.filter(task => !task.completed && task.dueDate)
    
    // Process each task
    for (const task of tasks) {
      try {
        const eventId = getEventIdForTask(events, task)
        
        if (eventId) {
          // Update existing event
          await updateGoogleEvent(authStore.googleToken, eventId, task)
        } else {
          // Create new event
          await createGoogleEvent(authStore.googleToken, task)
        }
        
        syncStats.value.total++
      } catch (e) {
        console.error(`Failed to sync task ${task.id}:`, e)
        syncStats.value.errors++
        
        if (e instanceof Error && e.message === 'UNAUTHORIZED') {
          throw e // Re-throw auth errors to handle them in the outer catch
        }
      }
    }

    lastSyncTime.value = new Date().toISOString()
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'UNAUTHORIZED') {
        error.value = 'Session expired. Please reconnect your Google account.'
        authStore.clearGoogleAuth()
      } else {
        error.value = e.message
      }
    } else {
      error.value = 'Failed to sync with Google Calendar'
    }
  } finally {
    isLoading.value = false
  }
}
</script> 