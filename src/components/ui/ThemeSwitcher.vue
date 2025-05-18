<template>
  <div class="relative">
    <Tooltip text="Toggle theme">
      <button
        @click="toggleTheme"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        <TransitionWrapper mode="out-in">
          <div v-if="isDark" key="dark" class="text-gray-900 dark:text-gray-100">
            <SunIcon class="w-5 h-5" />
          </div>
          <div v-else key="light" class="text-gray-900 dark:text-gray-100">
            <MoonIcon class="w-5 h-5" />
          </div>
        </TransitionWrapper>
      </button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import TransitionWrapper from './TransitionWrapper.vue'
import Tooltip from './Tooltip.vue'

const isDark = useDark()
const toggleTheme = useToggle(isDark)
</script> 