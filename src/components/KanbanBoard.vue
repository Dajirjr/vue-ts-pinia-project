<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTaskStore, type Task } from '@/stores/taskStore'
import TaskCard from './TaskCard.vue'
import draggable from 'vuedraggable'

const taskStore = useTaskStore()
const showNewTaskModal = ref(false)
const newTask = ref({
  title: '',
  description: '',
})

// Computed properties from the store
const todoTasks = computed(() => taskStore.todoTasks)
const inProgressTasks = computed(() => taskStore.inProgressTasks)
const doneTasks = computed(() => taskStore.doneTasks)

// Methods
async function createNewTask() {
  if (!newTask.value.title) return

  await taskStore.createTask({
    title: newTask.value.title,
    description: newTask.value.description,
    status: 'todo',
  })

  // Reset form and close modal
  newTask.value = { title: '', description: '' }
  showNewTaskModal.value = false
}

async function updateTaskStatus(task: Task, newStatus: 'todo' | 'in-progress' | 'done') {
  await taskStore.updateTask(task.id, { status: newStatus })
}

function onDragEnd(evt: any) {
  const task = evt.item.__draggable_context.element
  const newStatus = getColumnStatus(evt.to)
  if (task && newStatus && task.status !== newStatus) {
    updateTaskStatus(task, newStatus)
  }
}

function getColumnStatus(element: HTMLElement): 'todo' | 'in-progress' | 'done' | null {
  const column = element.closest('.kanban-column')
  if (!column) return null
  
  const columnTitle = column.querySelector('h3')?.textContent?.toLowerCase() || ''
  if (columnTitle.includes('to do')) return 'todo'
  if (columnTitle.includes('in progress')) return 'in-progress'
  if (columnTitle.includes('done')) return 'done'
  return null
}

function openTaskDetails(task: Task) {
  // Emit event for task details modal/drawer
  // This can be implemented later if needed
}

// Fetch tasks when component is mounted
onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<template>
  <div class="kanban-board p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Task Board</h2>
      <button 
        @click="showNewTaskModal = true"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        + New Task
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- To Do Column -->
      <div class="kanban-column bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          To Do
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ todoTasks.length }})</span>
        </h3>
        <draggable
          v-model="todoTasks"
          group="tasks"
          :animation="200"
          ghost-class="ghost"
          @end="onDragEnd"
          item-key="id"
        >
          <template #item="{ element }">
            <TaskCard
              :task="element"
              class="mb-3"
              @click="openTaskDetails(element)"
              @update:status="updateTaskStatus(element, $event)"
            />
          </template>
        </draggable>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          In Progress
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ inProgressTasks.length }})</span>
        </h3>
        <draggable
          v-model="inProgressTasks"
          group="tasks"
          :animation="200"
          ghost-class="ghost"
          @end="onDragEnd"
          item-key="id"
        >
          <template #item="{ element }">
            <TaskCard
              :task="element"
              class="mb-3"
              @click="openTaskDetails(element)"
              @update:status="updateTaskStatus(element, $event)"
            />
          </template>
        </draggable>
      </div>

      <!-- Done Column -->
      <div class="kanban-column bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Done
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ doneTasks.length }})</span>
        </h3>
        <draggable
          v-model="doneTasks"
          group="tasks"
          :animation="200"
          ghost-class="ghost"
          @end="onDragEnd"
          item-key="id"
        >
          <template #item="{ element }">
            <TaskCard
              :task="element"
              class="mb-3"
              @click="openTaskDetails(element)"
              @update:status="updateTaskStatus(element, $event)"
            />
          </template>
        </draggable>
      </div>
    </div>

    <!-- New Task Modal -->
    <div v-if="showNewTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">New Task</h3>
        <form @submit.prevent="createNewTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              v-model="newTask.title"
              type="text"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            >
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="newTask.description"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows="3"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showNewTaskModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-column {
  min-height: 400px;
  transition: background-color 0.2s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.task-card {
  cursor: move;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 