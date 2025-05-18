<template>
  <TransitionWrapper>
    <div 
      v-if="toasts.length"
      aria-live="polite"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      <TransitionWrapper
        v-for="toast in toasts"
        :key="toast.id"
        name="fade-slide-up"
      >
        <div
          :class="[
            'flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg',
            'text-sm font-medium',
            typeClasses[toast.type]
          ]"
          role="alert"
        >
          <component 
            :is="typeIcons[toast.type]"
            class="h-5 w-5 flex-shrink-0"
          />
          {{ toast.message }}
          <button
            @click="removeToast(toast.id)"
            class="ml-2 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>
      </TransitionWrapper>
    </div>
  </TransitionWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XIcon, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'
import TransitionWrapper from './TransitionWrapper.vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  timeout?: number
}

const toasts = ref<Toast[]>([])
let counter = 0

const typeClasses = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const addToast = (message: string, type: ToastType = 'info', timeout = 3000) => {
  const id = counter++
  const toast: Toast = { id, message, type }
  toasts.value.push(toast)

  if (timeout) {
    setTimeout(() => removeToast(id), timeout)
  }
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods to global app instance
const app = getCurrentInstance()
if (app) {
  app.appContext.app.config.globalProperties.$toast = {
    show: addToast,
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    warning: (message: string) => addToast(message, 'warning'),
    info: (message: string) => addToast(message, 'info')
  }
}
</script>

<script lang="ts">
// Type declarations for global toast methods
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: {
      show: (message: string, type?: 'success' | 'error' | 'warning' | 'info', timeout?: number) => void
      success: (message: string) => void
      error: (message: string) => void
      warning: (message: string) => void
      info: (message: string) => void
    }
  }
}
</script> 