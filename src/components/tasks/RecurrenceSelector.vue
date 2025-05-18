<template>
  <div class="space-y-2">
    <label class="block font-semibold text-sm">Repeat</label>
    <select 
      v-model="recurrence" 
      class="w-full rounded border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="none">Does not repeat</option>
      <option value="daily">Every day</option>
      <option value="weekly">Every week</option>
      <option value="monthly">Every month</option>
    </select>

    <div v-if="recurrence !== 'none'" class="space-y-1 mt-2">
      <label class="text-sm font-medium text-gray-700">End Date (optional)</label>
      <div class="relative">
        <input 
          type="date" 
          v-model="recurrenceEndDate" 
          class="w-full border-gray-300 p-2 rounded text-sm focus:border-blue-500 focus:ring-blue-500"
          :min="minEndDate"
        />
        <button 
          v-if="recurrenceEndDate"
          @click="recurrenceEndDate = null"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Task will repeat {{ getRecurrenceText }} until {{ recurrenceEndDate ? formatDate(recurrenceEndDate) : 'cancelled' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { XIcon } from 'lucide-vue-next'
import { format } from 'date-fns'

const recurrence = defineModel<'none' | 'daily' | 'weekly' | 'monthly'>('recurrence', {
  required: true
})

const recurrenceEndDate = defineModel<string | null>('recurrenceEndDate', {
  default: null
})

const minEndDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const getRecurrenceText = computed(() => {
  switch (recurrence.value) {
    case 'daily':
      return 'every day'
    case 'weekly':
      return 'every week'
    case 'monthly':
      return 'every month'
    default:
      return ''
  }
})

function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}
</script> 