import { computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark()
  const toggleTheme = useToggle(isDark)

  const theme = computed(() => isDark.value ? 'dark' : 'light')

  return {
    theme,
    isDark,
    toggleTheme
  }
} 