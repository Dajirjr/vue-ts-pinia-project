<template>
  <div id="pdf-report" class="p-6 text-sm bg-white text-black print:block">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Weekly Productivity Report</h1>
      <p class="text-gray-500">{{ formatDateRange }}</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="p-4 bg-gray-50 rounded">
        <h2 class="font-semibold mb-2">Task Progress</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600 text-sm">Completed</p>
            <p class="text-2xl font-bold">{{ stats.completed }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">In Progress</p>
            <p class="text-2xl font-bold">{{ stats.inProgress }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Completion Rate</p>
            <p class="text-2xl font-bold">{{ completionRate }}%</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Focus Time</p>
            <p class="text-2xl font-bold">{{ formatFocusTime }}</p>
          </div>
        </div>
      </div>

      <!-- Priority Distribution -->
      <div class="p-4 bg-gray-50 rounded">
        <h2 class="font-semibold mb-2">Priority Distribution</h2>
        <div class="space-y-2">
          <div v-for="(count, priority) in stats.byPriority" :key="priority" class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2"
              :class="{
                'bg-red-500': priority === 'high',
                'bg-yellow-500': priority === 'medium',
                'bg-green-500': priority === 'low'
              }"
            ></div>
            <span class="capitalize">{{ priority }}:</span>
            <span class="ml-2 font-medium">{{ count }} tasks</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Activity -->
    <div class="mb-6">
      <h2 class="font-semibold mb-2">Daily Activity</h2>
      <div class="space-y-2">
        <div v-for="(count, day) in stats.byDay" :key="day" class="flex items-center">
          <span class="w-16 text-gray-600">{{ day }}</span>
          <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-4">
            <div class="h-full bg-blue-500 rounded-full"
              :style="{ width: `${(count / maxDailyTasks) * 100}%` }"
            ></div>
          </div>
          <span class="text-gray-600 w-16 text-right">{{ count }} tasks</span>
        </div>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="mt-8">
      <h2 class="font-semibold mb-2">AI Insights & Recommendations</h2>
      <div class="prose prose-sm max-w-none">
        {{ summary }}
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 pt-4 border-t text-gray-500 text-xs">
      <p>Generated on {{ new Date().toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'

interface Props {
  stats: {
    completed: number
    inProgress: number
    focusMinutes: number
    weekStart: string
    weekEnd: string
    byPriority: {
      high: number
      medium: number
      low: number
    }
    byDay: Record<string, number>
  }
  summary: string
}

const props = defineProps<Props>()

const formatDateRange = computed(() => {
  const start = new Date(props.stats.weekStart)
  const end = new Date(props.stats.weekEnd)
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
})

const completionRate = computed(() => {
  const total = props.stats.completed + props.stats.inProgress
  return total ? Math.round((props.stats.completed / total) * 100) : 0
})

const formatFocusTime = computed(() => {
  const hours = Math.floor(props.stats.focusMinutes / 60)
  const minutes = props.stats.focusMinutes % 60
  return `${hours}h ${minutes}m`
})

const maxDailyTasks = computed(() => {
  return Math.max(...Object.values(props.stats.byDay))
})
</script>

<style scoped>
@media print {
  #pdf-report {
    @apply p-8;
    @apply max-w-none;
  }
}
</style> 