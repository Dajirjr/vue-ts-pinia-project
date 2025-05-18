<!-- TaskStats.vue -->
<template>
  <div class="task-stats p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Weekly Progress</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="stat-card p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
        <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300">Tasks Completed</h3>
        <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">
          {{ completedTasksCount }}
        </p>
      </div>
      
      <div class="stat-card p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <h3 class="text-lg font-semibold text-green-700 dark:text-green-300">Focus Time</h3>
        <p class="text-3xl font-bold text-green-600 dark:text-green-400">
          {{ totalFocusHours }}h
        </p>
      </div>
    </div>

    <div class="mb-6">
      <canvas ref="chartRef"></canvas>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(count, status) in tasksByStatus"
        :key="status"
        class="stat-card p-4 rounded-lg"
        :class="getStatusColor(status)"
      >
        <h3 class="text-sm font-semibold capitalize">{{ status }}</h3>
        <p class="text-2xl font-bold">{{ count }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import Chart from 'chart.js/auto'

const taskStore = useTaskStore()
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Computed properties
const completedTasksCount = computed(() => taskStore.doneTasks.length)

const totalFocusHours = computed(() => {
  return taskStore.tasks.reduce((total, task) => {
    if (task.pomodoroSessions) {
      return total + task.pomodoroSessions.reduce((sessionTotal, session) => {
        return sessionTotal + session.duration / 60
      }, 0)
    }
    return total
  }, 0).toFixed(1)
})

const tasksByStatus = computed(() => ({
  'To Do': taskStore.todoTasks.length,
  'In Progress': taskStore.inProgressTasks.length,
  'Done': taskStore.doneTasks.length
}))

// Methods
function getStatusColor(status: string) {
  const colors = {
    'To Do': 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'In Progress': 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    'Done': 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
  }
  return colors[status as keyof typeof colors]
}

function createChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const stats = taskStore.weeklyStats
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const data = labels.map(day => stats[day] || 0)

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tasks Completed',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

// Lifecycle hooks
onMounted(async () => {
  await taskStore.fetchTasks()
  createChart()
})

// Watch for changes in task data
watch(() => taskStore.weeklyStats, () => {
  if (chart) {
    chart.destroy()
  }
  createChart()
}, { deep: true })

// Clean up
onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.task-stats {
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style> 