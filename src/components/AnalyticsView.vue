<!-- Analytics dashboard with Chart.js integration -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { Chart, registerables } from 'chart.js'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import type { Task } from '@/types/task'
import WeeklyReport from './WeeklyReport.vue'

// Register Chart.js components
Chart.register(...registerables)

const taskStore = useTaskStore()
const selectedTimeframe = ref<'week' | 'month' | 'year'>('week')
const activeTab = ref<'charts' | 'report'>('charts')

const timeframeInDays = computed(() => {
  switch (selectedTimeframe.value) {
    case 'week': return 7
    case 'month': return 30
    case 'year': return 365
  }
})

const dateRange = computed(() => {
  const end = new Date()
  const start = subDays(end, timeframeInDays.value)
  return eachDayOfInterval({ start, end })
})

// Task completion velocity
const taskVelocity = computed(() => {
  const days = dateRange.value
  const data = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    return taskStore.tasks.filter(task => 
      task.status === 'done' && 
      format(new Date(task.updatedAt), 'yyyy-MM-dd') === dayStr
    ).length
  })

  return {
    labels: days.map(day => format(day, 'MMM d')),
    datasets: [{
      label: 'Tasks Completed',
      data,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// Focus time distribution
const focusTimeDistribution = computed(() => {
  const totalMinutes = taskStore.tasks.reduce((acc, task) => {
    if (!task.pomodoroSessions) return acc
    return acc + task.pomodoroSessions.reduce((sum, session) => sum + session.duration, 0)
  }, 0)

  const categories = ['Deep Work', 'Meetings', 'Planning', 'Review']
  const data = categories.map(() => Math.floor(Math.random() * totalMinutes)) // Mock data for now

  return {
    labels: categories,
    datasets: [{
      data,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  }
})

// Productivity score
const productivityScore = computed(() => {
  const completedTasks = taskStore.tasks.filter(t => t.status === 'done').length
  const totalTasks = taskStore.tasks.length
  return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
})

// Task breakdown by priority
const tasksByPriority = computed(() => {
  const counts = {
    high: 0,
    medium: 0,
    low: 0
  }

  taskStore.tasks.forEach(task => {
    counts[task.priority]++
  })

  return {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [counts.high, counts.medium, counts.low],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ]
    }]
  }
})

onMounted(async () => {
  await taskStore.fetchTasks()

  if (activeTab.value === 'charts') {
    initializeCharts()
  }
})

const initializeCharts = () => {
  // Task Velocity Chart
  new Chart(document.getElementById('taskVelocityChart') as HTMLCanvasElement, {
    type: 'line',
    data: taskVelocity.value,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Task Completion Velocity'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })

  // Focus Time Chart
  new Chart(document.getElementById('focusTimeChart') as HTMLCanvasElement, {
    type: 'doughnut',
    data: focusTimeDistribution.value,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Focus Time Distribution'
        }
      }
    }
  })

  // Priority Distribution Chart
  new Chart(document.getElementById('priorityChart') as HTMLCanvasElement, {
    type: 'pie',
    data: tasksByPriority.value,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Tasks by Priority'
        }
      }
    }
  })
}
</script>

<template>
  <div class="analytics-view">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Analytics Dashboard</h1>
      <div class="flex items-center space-x-4">
        <!-- Tab Switcher -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
          <button 
            v-for="tab in ['charts', 'report']"
            :key="tab"
            class="px-4 py-2 text-sm rounded-md"
            :class="activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-600'"
            @click="activeTab = tab"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <!-- Timeframe Selector (only for charts) -->
        <div v-if="activeTab === 'charts'" class="flex items-center space-x-2">
          <button 
            v-for="timeframe in ['week', 'month', 'year']"
            :key="timeframe"
            class="px-3 py-1 text-sm rounded"
            :class="selectedTimeframe === timeframe ? 'bg-blue-500 text-white' : 'bg-gray-200'"
            @click="selectedTimeframe = timeframe"
          >
            {{ timeframe.charAt(0).toUpperCase() + timeframe.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Charts View -->
    <div v-if="activeTab === 'charts'">
      <!-- Stats Overview -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Productivity Score</h3>
          <div class="mt-2 flex items-end">
            <span class="text-2xl font-bold">{{ productivityScore }}%</span>
            <span class="ml-2 text-sm text-green-500">↑ 12%</span>
          </div>
        </div>
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Tasks Completed</h3>
          <div class="mt-2 flex items-end">
            <span class="text-2xl font-bold">{{ taskStore.doneTasks.length }}</span>
            <span class="ml-2 text-sm text-gray-500">of {{ taskStore.tasks.length }}</span>
          </div>
        </div>
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Focus Time</h3>
          <div class="mt-2 flex items-end">
            <span class="text-2xl font-bold">4h 32m</span>
            <span class="ml-2 text-sm text-green-500">↑ 8%</span>
          </div>
        </div>
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500">Active Projects</h3>
          <div class="mt-2 flex items-end">
            <span class="text-2xl font-bold">{{ taskStore.inProgressTasks.length }}</span>
            <span class="ml-2 text-sm text-yellow-500">→ 0%</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Task Velocity -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <canvas id="taskVelocityChart"></canvas>
        </div>

        <!-- Focus Time Distribution -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <canvas id="focusTimeChart"></canvas>
        </div>

        <!-- Priority Distribution -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <canvas id="priorityChart"></canvas>
        </div>

        <!-- Weekly Summary -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium mb-4">Weekly Summary</h3>
          <div class="space-y-4">
            <div v-for="(count, day) in taskStore.weeklyStats" :key="day" class="flex items-center">
              <span class="w-12 text-sm text-gray-500">{{ day }}</span>
              <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full"
                  :style="{ width: `${(count / Math.max(...Object.values(taskStore.weeklyStats))) * 100}%` }"
                ></div>
              </div>
              <span class="ml-2 text-sm">{{ count }} tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Report View -->
    <WeeklyReport v-else />
  </div>
</template>

<style scoped>
.analytics-view {
  @apply p-6 max-w-7xl mx-auto;
}
</style> 