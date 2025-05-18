<!-- FocusTimer.vue -->
<template>
  <div class="focus-timer p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Focus Timer</h2>
      <div class="text-4xl font-mono font-bold text-primary-600 dark:text-primary-400">
        {{ formatTime(timeRemaining) }}
      </div>
    </div>

    <div class="flex justify-center space-x-4 mb-6">
      <button
        @click="startTimer"
        :disabled="isRunning"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        Start
      </button>
      <button
        @click="pauseTimer"
        :disabled="!isRunning"
        class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
      >
        Pause
      </button>
      <button
        @click="resetTimer"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Reset
      </button>
    </div>

    <div class="flex justify-center space-x-4 mb-6">
      <button
        v-for="duration in durations"
        :key="duration"
        @click="setDuration(duration)"
        :class="[
          'px-3 py-1 rounded-full text-sm',
          selectedDuration === duration
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        ]"
      >
        {{ duration }}min
      </button>
    </div>

    <div v-if="currentTask" class="text-center mb-4">
      <p class="text-gray-600 dark:text-gray-400">
        Current Task: {{ currentTask.title }}
      </p>
    </div>

    <div v-if="completedSessions.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Today's Sessions</h3>
      <div class="space-y-2">
        <div
          v-for="(session, index) in todaySessions"
          :key="index"
          class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatTime(session.duration * 60) }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ new Date(session.startTime).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore, type PomodoroSession } from '@/stores/taskStore'

const taskStore = useTaskStore()

const durations = [25, 15, 5]
const selectedDuration = ref(25)
const timeRemaining = ref(selectedDuration.value * 60)
const isRunning = ref(false)
const timer = ref<number | null>(null)
const currentTask = ref(null)
const completedSessions = ref<PomodoroSession[]>([])

const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return completedSessions.value.filter(session => 
    new Date(session.startTime).toDateString() === today
  )
})

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function setDuration(minutes: number) {
  if (!isRunning.value) {
    selectedDuration.value = minutes
    timeRemaining.value = minutes * 60
  }
}

function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true
    timer.value = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        completeSession()
      }
    }, 1000)
  }
}

function pauseTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
    isRunning.value = false
  }
}

function resetTimer() {
  pauseTimer()
  timeRemaining.value = selectedDuration.value * 60
}

async function completeSession() {
  pauseTimer()
  
  const session: Omit<PomodoroSession, 'taskId'> = {
    startTime: new Date(Date.now() - selectedDuration.value * 60 * 1000).toISOString(),
    endTime: new Date().toISOString(),
    duration: selectedDuration.value
  }

  if (currentTask.value?.id) {
    await taskStore.addPomodoroSession(currentTask.value.id, session)
  }

  completedSessions.value.push({ ...session, taskId: currentTask.value?.id || '' })
  
  // Reset timer
  timeRemaining.value = selectedDuration.value * 60
}

// Clean up timer on component unmount
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.focus-timer {
  max-width: 400px;
  margin: 0 auto;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.text-primary-600 {
  animation: pulse 2s infinite;
}
</style> 