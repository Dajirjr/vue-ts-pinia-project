<template>
  <TransitionWrapper>
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="skipTour" />
      
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentStep.title }}
            </h2>
            <button 
              @click="skipTour"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="prose dark:prose-invert mb-6">
            <p>{{ currentStep.description }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                :class="[
                  'w-2 h-2 rounded-full',
                  currentStepIndex === index 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                ]"
              />
            </div>

            <div class="flex gap-3">
              <button
                v-if="currentStepIndex > 0"
                @click="previousStep"
                class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                @click="nextStep"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ isLastStep ? 'Finish' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { XIcon } from 'lucide-vue-next'
import TransitionWrapper from '../ui/TransitionWrapper.vue'

const steps = [
  {
    title: 'Welcome to VisionBoard! 👋',
    description: 'Let\'s take a quick tour to help you get started with our task management system.'
  },
  {
    title: 'Create Your First Task ✨',
    description: 'Click the "+" button to create a new task. Add a title, description, and set priority levels.'
  },
  {
    title: 'Organize with Kanban 📋',
    description: 'Drag and drop tasks between columns to update their status. Use the board to visualize your workflow.'
  },
  {
    title: 'AI-Powered Planning 🤖',
    description: 'Try our AI assistant to get smart suggestions for task organization and time management.'
  },
  {
    title: 'Track Your Progress 📊',
    description: 'View your productivity stats and completed tasks in the analytics dashboard.'
  }
]

const isVisible = ref(true)
const currentStepIndex = ref(0)

const currentStep = computed(() => steps[currentStepIndex.value])
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1)

const nextStep = () => {
  if (isLastStep.value) {
    completeTour()
  } else {
    currentStepIndex.value++
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const skipTour = () => {
  completeTour()
}

const completeTour = () => {
  isVisible.value = false
  localStorage.setItem('onboardingCompleted', 'true')
  emit('complete')
}

const emit = defineEmits<{
  (e: 'complete'): void
}>()

// Check if user has completed onboarding
onMounted(() => {
  const completed = localStorage.getItem('onboardingCompleted')
  if (completed === 'true') {
    isVisible.value = false
  }
})
</script> 