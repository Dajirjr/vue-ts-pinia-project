<template>
  <Tooltip :text="tooltipText">
    <div 
      :class="[
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        priorityClasses[priority]
      ]"
    >
      <component 
        :is="priorityIcons[priority]" 
        class="w-3 h-3 mr-1"
        :strokeWidth="3"
      />
      {{ priorityLabels[priority] }}
    </div>
  </Tooltip>
</template>

<script setup lang="ts">
import { Flag, AlertTriangle, AlertCircle } from 'lucide-vue-next'
import Tooltip from './Tooltip.vue'

type Priority = 'low' | 'medium' | 'high'

interface Props {
  priority: Priority
}

const props = defineProps<Props>()

const priorityClasses = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const priorityIcons = {
  low: Flag,
  medium: AlertTriangle,
  high: AlertCircle
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
}

const tooltipText = computed(() => `${priorityLabels[props.priority]} Priority Task`)
</script> 