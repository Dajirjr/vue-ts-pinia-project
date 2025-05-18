<!-- Calendar view with task integration -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/types/task'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns'

const taskStore = useTaskStore()
const viewMode = ref<'week' | 'month'>('week')
const currentDate = ref(new Date())

const weekDays = computed(() => {
  const start = startOfWeek(currentDate.value, { weekStartsOn: 1 }) // Start on Monday
  const end = endOfWeek(currentDate.value, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
})

const tasksByDay = computed(() => {
  const days = new Map<string, Task[]>()
  
  weekDays.value.forEach(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    days.set(dayStr, [])
  })

  taskStore.tasks.forEach(task => {
    if (!task.dueDate) return

    const taskDate = new Date(task.dueDate)
    const dayStr = format(taskDate, 'yyyy-MM-dd')
    
    if (days.has(dayStr)) {
      days.get(dayStr)?.push(task)
    }
  })

  return days
})

const timeSlots = computed(() => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    slots.push(format(new Date().setHours(hour, 0), 'HH:mm'))
  }
  return slots
})

const navigateWeek = (direction: 'prev' | 'next') => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
  currentDate.value = newDate
}

onMounted(async () => {
  await taskStore.fetchTasks()
})
</script>

<template>
  <div class="calendar-view">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <button 
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="navigateWeek('prev')"
        >
          Previous
        </button>
        <h2 class="text-xl font-semibold">
          {{ format(weekDays[0], 'MMMM d') }} - {{ format(weekDays[6], 'MMMM d, yyyy') }}
        </h2>
        <button 
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="navigateWeek('next')"
        >
          Next
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          class="px-3 py-1 text-sm"
          :class="viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="viewMode = 'week'"
        >
          Week
        </button>
        <button 
          class="px-3 py-1 text-sm"
          :class="viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="viewMode = 'month'"
        >
          Month
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid border border-gray-200 rounded-lg overflow-hidden">
      <!-- Days Header -->
      <div class="grid grid-cols-8 border-b border-gray-200">
        <div class="p-2 border-r border-gray-200 bg-gray-50"></div>
        <div 
          v-for="day in weekDays" 
          :key="format(day, 'yyyy-MM-dd')"
          class="p-2 text-center border-r border-gray-200 bg-gray-50 last:border-r-0"
        >
          <div class="font-medium">{{ format(day, 'EEE') }}</div>
          <div class="text-sm text-gray-500">{{ format(day, 'd') }}</div>
        </div>
      </div>

      <!-- Time Grid -->
      <div class="grid grid-cols-8">
        <!-- Time slots -->
        <div class="border-r border-gray-200">
          <div 
            v-for="slot in timeSlots" 
            :key="slot"
            class="h-20 p-2 text-xs text-gray-500 border-b border-gray-200 last:border-b-0"
          >
            {{ slot }}
          </div>
        </div>

        <!-- Day columns -->
        <div 
          v-for="day in weekDays" 
          :key="format(day, 'yyyy-MM-dd')"
          class="border-r border-gray-200 last:border-r-0"
        >
          <div 
            v-for="slot in timeSlots" 
            :key="slot"
            class="h-20 p-2 border-b border-gray-200 last:border-b-0 relative group"
          >
            <!-- Tasks for this time slot -->
            <div 
              v-for="task in tasksByDay.get(format(day, 'yyyy-MM-dd'))" 
              :key="task.id"
              class="absolute inset-x-0 mx-1 p-1 text-xs rounded bg-blue-100 border border-blue-200"
              :class="{
                'bg-green-100 border-green-200': task.status === 'done',
                'bg-yellow-100 border-yellow-200': task.status === 'in-progress'
              }"
            >
              <div class="font-medium truncate">{{ task.title }}</div>
              <div class="text-xs text-gray-500 truncate">{{ task.description }}</div>
            </div>

            <!-- Hover state for adding new tasks -->
            <div class="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="w-full h-full text-blue-500 text-xs font-medium">
                + Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  @apply p-4 bg-white rounded-lg shadow-sm;
}

.calendar-grid {
  height: calc(100vh - 12rem);
  overflow-y: auto;
}
</style> 