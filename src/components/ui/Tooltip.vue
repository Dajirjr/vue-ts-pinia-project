<template>
  <div class="relative inline-block">
    <div 
      ref="trigger"
      class="group"
      @mouseenter="show = true"
      @mouseleave="show = false"
      @focus="show = true"
      @blur="show = false"
    >
      <slot />
    </div>
    <TransitionWrapper name="fade-slide-down" :duration="200">
      <div 
        v-if="show"
        ref="tooltip"
        :class="[
          'absolute z-50 px-2 py-1 text-xs font-medium',
          'bg-gray-900 text-white dark:bg-gray-700',
          'rounded shadow-lg max-w-xs',
          positionClasses[position]
        ]"
        role="tooltip"
      >
        {{ text }}
        <div 
          :class="[
            'absolute w-2 h-2 rotate-45',
            'bg-gray-900 dark:bg-gray-700',
            arrowPositionClasses[position]
          ]"
        />
      </div>
    </TransitionWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TransitionWrapper from './TransitionWrapper.vue'

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top'
})

const show = ref(false)
const trigger = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)

const positionClasses = {
  top: '-top-1 left-1/2 -translate-x-1/2 -translate-y-full mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 -translate-x-1 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 translate-x-1 ml-2'
}

const arrowPositionClasses = {
  top: '-bottom-1 left-1/2 -translate-x-1/2',
  bottom: '-top-1 left-1/2 -translate-x-1/2',
  left: '-right-1 top-1/2 -translate-y-1/2',
  right: '-left-1 top-1/2 -translate-y-1/2'
}

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    tooltip.value && 
    trigger.value && 
    !tooltip.value.contains(event.target as Node) && 
    !trigger.value.contains(event.target as Node)
  ) {
    show.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 