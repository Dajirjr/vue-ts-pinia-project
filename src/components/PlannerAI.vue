<template>
  <div class="planner-ai p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">AI Task Planner</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Let AI help you organize and prioritize your tasks effectively.
      </p>
    </div>

    <div class="mb-6">
      <textarea
        v-model="userInput"
        placeholder="Describe your tasks or goals (e.g., 'Help me plan my work day with 3 main priorities')"
        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        rows="4"
      ></textarea>
    </div>

    <div class="flex justify-between items-center mb-6">
      <button
        @click="generatePlan"
        :disabled="isLoading || !userInput"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <span v-if="isLoading" class="mr-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </span>
        Generate Plan
      </button>

      <div class="flex items-center space-x-2">
        <button
          v-for="style in planningStyles"
          :key="style"
          @click="selectedStyle = style"
          :class="[
            'px-3 py-1 rounded-full text-sm',
            selectedStyle === style
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          ]"
        >
          {{ style }}
        </button>
      </div>
    </div>

    <div v-if="aiResponse" class="ai-response space-y-4">
      <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="prose dark:prose-invert max-w-none" v-html="formattedResponse"></div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          v-if="suggestedTasks.length > 0"
          @click="createTasks"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          <span class="mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </span>
          Create Tasks
        </button>
        
        <button
          @click="regeneratePlan"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Regenerate
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
      :class="{ 'opacity-0': !showSuccessToast }"
    >
      Tasks created successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const taskStore = useTaskStore()
const userInput = ref('')
const aiResponse = ref('')
const isLoading = ref(false)
const showSuccessToast = ref(false)
const planningStyles = ['Detailed', 'Concise', 'Timeline']
const selectedStyle = ref('Detailed')

const suggestedTasks = ref<Array<{ title: string; description: string }>>([])

const formattedResponse = computed(() => {
  if (!aiResponse.value) return ''
  const html = marked(aiResponse.value)
  return DOMPurify.sanitize(html)
})

async function generatePlan() {
  try {
    isLoading.value = true
    suggestedTasks.value = []
    
    const response = await fetch('/api/planner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userInput.value,
        style: selectedStyle.value,
      }),
    })

    if (!response.ok) throw new Error('Failed to generate plan')
    
    const data = await response.json()
    aiResponse.value = data.response
    suggestedTasks.value = data.tasks || []
  } catch (error) {
    console.error('Error generating plan:', error)
    aiResponse.value = 'Sorry, there was an error generating your plan. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function createTasks() {
  try {
    for (const task of suggestedTasks.value) {
      await taskStore.createTask({
        title: task.title,
        description: task.description,
        status: 'todo',
      })
    }
    
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
    
    // Clear the form
    userInput.value = ''
    aiResponse.value = ''
    suggestedTasks.value = []
  } catch (error) {
    console.error('Error creating tasks:', error)
  }
}

function regeneratePlan() {
  aiResponse.value = ''
  suggestedTasks.value = []
  generatePlan()
}
</script>

<style scoped>
.planner-ai {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.prose) {
  color: inherit;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3) {
  color: inherit;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 