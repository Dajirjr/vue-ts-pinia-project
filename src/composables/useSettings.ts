import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export interface TimerSettings {
  focusDuration: number
  breakDuration: number
}

export interface UserSettings {
  timer: TimerSettings
  notifications: boolean
  soundEnabled: boolean
}

const defaultSettings: UserSettings = {
  timer: {
    focusDuration: 25,
    breakDuration: 5
  },
  notifications: true,
  soundEnabled: true
}

export function useSettings() {
  const settings = useStorage&lt;UserSettings>('user-settings', defaultSettings)

  const setFocusDuration = (duration: number) => {
    settings.value.timer.focusDuration = duration
  }

  const setBreakDuration = (duration: number) => {
    settings.value.timer.breakDuration = duration
  }

  const setTimerPreset = (preset: '25/5' | '50/10') => {
    const [focus, break_] = preset.split('/').map(Number)
    settings.value.timer.focusDuration = focus
    settings.value.timer.breakDuration = break_
  }

  const toggleNotifications = () => {
    settings.value.notifications = !settings.value.notifications
  }

  const toggleSound = () => {
    settings.value.soundEnabled = !settings.value.soundEnabled
  }

  return {
    settings,
    setFocusDuration,
    setBreakDuration,
    setTimerPreset,
    toggleNotifications,
    toggleSound,
    // Computed getters
    focusDuration: computed(() => settings.value.timer.focusDuration),
    breakDuration: computed(() => settings.value.timer.breakDuration),
    notificationsEnabled: computed(() => settings.value.notifications),
    soundEnabled: computed(() => settings.value.soundEnabled)
  }
} 