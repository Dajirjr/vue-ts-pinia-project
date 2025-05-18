<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/stores/taskStore'
import { Settings } from 'lucide-vue-next';

interface Props {
  task: Task
}

defineProps<Props>()
defineEmits<{
  (e: 'update:status', status: 'todo' | 'in-progress' | 'done'): void
  (e: 'click'): void
}>()

const showDetails = ref(false)

const totalFocusTime = computed(() => {
  if (!props.task.pomodoroSessions) return 0
  return props.task.pomodoroSessions.reduce((total, session) => total + session.duration, 0)
})
</script>

<template>
  <div 
    class="task-card p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div
            class="w-3 h-3 rounded-full"
            :class="{
              'bg-red-500': task.priority === 'high',
              'bg-yellow-500': task.priority === 'medium',
              'bg-blue-500': task.priority === 'low',
              'opacity-50': task.status === 'done'
            }"
          ></div>
        </div>
        <h3 
          class="text-lg font-medium text-gray-900 dark:text-white"
          :class="{ 'line-through opacity-50': task.status === 'done' }"
        >
          {{ task.title }}
        </h3>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="task.status !== 'done'"
          @click="$emit('update:status', 'done')"
          class="p-1 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
          title="Mark as complete"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </button>
        
        <button
          @click="showDetails = !showDetails"
          class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          :class="{ 'rotate-180': showDetails }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      >
        {{ tag }}
      </span>
    </div>

    <div
      v-if="showDetails"
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {{ task.description || 'No description provided.' }}
      </p>

      <div v-if="task.dueDate" class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Due {{ new Date(task.dueDate).toLocaleDateString() }}
      </div>

      <div v-if="task.pomodoroSessions && task.pomodoroSessions.length > 0" class="mt-2">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Focus Sessions: {{ task.pomodoroSessions.length }}
          ({{ totalFocusTime }} minutes)
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  cursor: move;
}

.task-card:hover {
  transform: translateY(-1px);
}

button {
  transition: all 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style> 