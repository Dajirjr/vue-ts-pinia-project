<template>
  <div class="space-y-6">
    <!-- Theme Settings -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Appearance
      </h3>
      <div class="flex items-center gap-4">
        <ThemeSwitcher />
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ theme }} theme
        </span>
      </div>
    </div>

    <!-- Timer Settings -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Focus Timer
      </h3>
      <div class="grid gap-3">
        <label class="flex items-center gap-2">
          <input
            type="radio"
            v-model="timerPreset"
            value="25/5"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ focusDuration }} min focus / {{ breakDuration }} min break (Pomodoro)
          </span>
        </label>
        <label class="flex items-center gap-2">
          <input
            type="radio"
            v-model="timerPreset"
            value="50/10"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700 dark:text-gray-300">
            50 min focus / 10 min break (Deep Work)
          </span>
        </label>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Notifications
      </h3>
      <div class="space-y-3">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="notificationsEnabled"
            @change="toggleNotifications"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Enable notifications
          </span>
        </label>
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="soundEnabled"
            @change="toggleSound"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Enable sound effects
          </span>
        </label>
      </div>
    </div>

    <!-- Onboarding Reset -->
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Onboarding
      </h3>
      <button
        @click="resetOnboarding"
        class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <RefreshCw class="h-4 w-4" />
        Reset onboarding tour
      </button>
    </div>

    <!-- Save Button -->
    <div class="pt-4">
      <button
        @click="saveSettings"
        class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import ThemeSwitcher from '../ui/ThemeSwitcher.vue'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'
import { useSettings } from '@/composables/useSettings'

const toast = useToast()
const { theme } = useTheme()
const {
  settings,
  setTimerPreset,
  focusDuration,
  breakDuration,
  notificationsEnabled,
  soundEnabled,
  toggleNotifications,
  toggleSound
} = useSettings()

const timerPreset = computed({
  get: () => `${focusDuration.value}/${breakDuration.value}`,
  set: (value: string) => setTimerPreset(value as '25/5' | '50/10')
})

const resetOnboarding = () => {
  localStorage.removeItem('onboardingCompleted')
  toast.success('Onboarding tour has been reset')
  window.location.reload()
}

const saveSettings = () => {
  toast.success('Settings saved successfully')
}

// Watch for changes and save automatically
watch(settings, () => {
  saveSettings()
}, { deep: true })
</script> 