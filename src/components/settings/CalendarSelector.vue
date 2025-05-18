<!-- Calendar Selector Component -->
<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      Select Calendar
    </label>
    
    <div class="relative">
      <select
        v-model="selectedCalendarId"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        :disabled="isLoading"
      >
        <option value="" disabled>Select a calendar</option>
        <option
          v-for="calendar in calendars"
          :key="calendar.id"
          :value="calendar.id"
        >
          {{ calendar.summary }}
          <span v-if="calendar.primary" class="text-gray-500">(Primary)</span>
        </option>
      </select>

      <div v-if="isLoading" class="absolute right-2 top-2">
        <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { withRetry } from '@/lib/utils/api'

interface GoogleCalendar {
  id: string
  summary: string
  primary?: boolean
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', error: string): void
}>()

const authStore = useAuthStore()
const calendars = ref<GoogleCalendar[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const selectedCalendarId = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

onMounted(async () => {
  await loadCalendars()
})

async function loadCalendars() {
  if (!authStore.googleToken) return

  isLoading.value = true
  error.value = null

  try {
    await authStore.refreshGoogleAuthIfNeeded()
    
    const response = await withRetry(async () => {
      const res = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            Authorization: `Bearer ${authStore.googleToken}`,
          },
        }
      )

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('UNAUTHORIZED')
        }
        throw new Error(`Failed to fetch calendars: ${res.statusText}`)
      }

      return res.json()
    })

    calendars.value = response.items
      .filter((cal: GoogleCalendar) => cal.accessRole === 'owner' || cal.accessRole === 'writer')
      .sort((a: GoogleCalendar, b: GoogleCalendar) => {
        // Primary calendar first, then alphabetically
        if (a.primary) return -1
        if (b.primary) return 1
        return a.summary.localeCompare(b.summary)
      })

    // If no calendar is selected and we have calendars, select the primary one
    if (!selectedCalendarId.value && calendars.value.length > 0) {
      const primaryCalendar = calendars.value.find(cal => cal.primary)
      if (primaryCalendar) {
        selectedCalendarId.value = primaryCalendar.id
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'UNAUTHORIZED') {
        error.value = 'Session expired. Please reconnect your Google account.'
        emit('error', error.value)
        authStore.clearGoogleAuth()
      } else {
        error.value = e.message
        emit('error', error.value)
      }
    } else {
      error.value = 'Failed to load calendars'
      emit('error', error.value)
    }
  } finally {
    isLoading.value = false
  }
}
</script> 