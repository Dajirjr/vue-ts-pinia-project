<template>
  <TransitionWrapper>
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity" 
        @click="$emit('update:modelValue', false)"
      />

      <!-- Modal -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <TransitionWrapper name="fade-slide-up" appear>
          <div 
            v-if="modelValue"
            class="relative w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl"
            @click.stop
          >
            <!-- Header -->
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h2>
              <button
                @click="$emit('update:modelValue', false)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close modal"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="prose dark:prose-invert max-w-none">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
              <slot name="footer" />
            </div>
          </div>
        </TransitionWrapper>
      </div>
    </div>
  </TransitionWrapper>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import TransitionWrapper from './TransitionWrapper.vue'
import { onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title: string
}

defineProps<Props>()
defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('update:modelValue', false)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script> 