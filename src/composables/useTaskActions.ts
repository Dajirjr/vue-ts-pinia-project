import { ref, computed } from 'vue'
import { useToast } from './useToast'
import { useTaskStore } from '@/stores/taskStore'
import type { Task, TaskAction, BatchOperation, TaskActionState } from '@/types/task'
import { v4 as uuidv4 } from 'uuid'

declare global {
  interface Window {
    undoLastTaskAction: () => Promise<void>
  }
}

const UNDO_TIMEOUT = 5000 // 5 seconds
const MAX_HISTORY_SIZE = 10

export function useTaskActions() {
  const toast = useToast()
  const taskStore = useTaskStore()
  const state = ref<TaskActionState>({
    loading: false,
    error: null,
    currentBatch: null,
    history: []
  })

  const canUndo = computed(() => {
    if (!state.value.history.length) return false
    const lastBatch = state.value.history[state.value.history.length - 1]
    return lastBatch.undoable && 
           Date.now() - lastBatch.timestamp < UNDO_TIMEOUT
  })

  const startBatch = () => {
    if (state.value.currentBatch) return state.value.currentBatch.id

    const batchId = uuidv4()
    state.value.currentBatch = {
      id: batchId,
      actions: [],
      timestamp: Date.now(),
      undoable: true
    }
    return batchId
  }

  const commitBatch = () => {
    if (!state.value.currentBatch) return

    state.value.history.push(state.value.currentBatch)
    if (state.value.history.length > MAX_HISTORY_SIZE) {
      state.value.history.shift()
    }

    // Start undo timeout
    setTimeout(() => {
      const index = state.value.history.findIndex(b => b.id === state.value.currentBatch?.id)
      if (index !== -1) {
        state.value.history[index].undoable = false
      }
    }, UNDO_TIMEOUT)

    state.value.currentBatch = null
  }

  const executeAction = async (action: TaskAction, optimistic = true) => {
    try {
      // Optimistic update
      if (optimistic) {
        switch (action.type) {
          case 'create':
            taskStore.addTask(action.task)
            break
          case 'update':
            taskStore.updateTaskOptimistic(action.task)
            break
          case 'delete':
            taskStore.removeTaskOptimistic(action.task.id)
            break
        }
      }

      // Server update
      switch (action.type) {
        case 'create': {
          const { id, userId, createdAt, updatedAt, ...taskData } = action.task
          const newTask = await taskStore.createTask(taskData)
          if (newTask) action.task.id = newTask.id
          break
        }
        case 'update':
          await taskStore.updateTask(action.task.id, action.task)
          break
        case 'delete':
          await taskStore.deleteTask(action.task.id)
          break
      }
      return true
    } catch (error) {
      console.error(`Failed to execute ${action.type} action:`, error)
      state.value.error = error as Error

      // Revert optimistic update on error
      if (optimistic) {
        switch (action.type) {
          case 'create':
            taskStore.removeTaskOptimistic(action.task.id)
            break
          case 'update':
            if (action.previousState) {
              taskStore.updateTaskOptimistic(action.previousState)
            }
            break
          case 'delete':
            taskStore.addTask(action.task)
            break
        }
      }
      return false
    }
  }

  const addToHistory = (action: TaskAction) => {
    const batchId = startBatch()
    action.batchId = batchId
    state.value.currentBatch!.actions.push(action)
  }

  const createTask = async (task: Task) => {
    const action: TaskAction = {
      type: 'create',
      task,
      timestamp: Date.now()
    }
    
    addToHistory(action)
    if (await executeAction(action)) {
      commitBatch()
      showUndoToast('Task created')
    }
  }

  const updateTask = async (task: Task, previousState: Task) => {
    const action: TaskAction = {
      type: 'update',
      task,
      previousState,
      timestamp: Date.now()
    }
    
    addToHistory(action)
    if (await executeAction(action)) {
      commitBatch()
      showUndoToast('Task updated')
    }
  }

  const deleteTask = async (task: Task) => {
    const action: TaskAction = {
      type: 'delete',
      task,
      timestamp: Date.now()
    }
    
    addToHistory(action)
    if (await executeAction(action)) {
      commitBatch()
      showUndoToast('Task deleted')
    }
  }

  const undoLastBatch = async () => {
    if (!canUndo.value) return

    const lastBatch = state.value.history.pop()
    if (!lastBatch) return

    state.value.loading = true
    state.value.error = null

    try {
      // Reverse the actions and execute them
      for (const action of [...lastBatch.actions].reverse()) {
        const undoAction: TaskAction = {
          type: action.type === 'create' ? 'delete' :
                action.type === 'delete' ? 'create' :
                'update',
          task: action.type === 'update' && action.previousState ? 
                action.previousState : action.task,
          previousState: action.type === 'update' ? action.task : undefined,
          timestamp: Date.now()
        }
        
        await executeAction(undoAction, false) // Don't use optimistic updates for undo
      }
      
      toast.success('Actions undone successfully')
    } catch (error) {
      console.error('Failed to undo actions:', error)
      toast.error('Failed to undo actions')
      // Put the batch back in history if undo fails
      state.value.history.push(lastBatch)
    } finally {
      state.value.loading = false
    }
  }

  const showUndoToast = (message: string) => {
    if (!canUndo.value) {
      toast.show(message, 'success')
      return
    }

    // Show toast with undo button
    toast.show(
      `${message} - <button class="text-blue-500 hover:text-blue-600 ml-2" onclick="window.undoLastTaskAction()">Undo</button>`,
      'info',
      UNDO_TIMEOUT
    )

    // Expose undo function globally for the toast button
    window.undoLastTaskAction = undoLastBatch
  }

  return {
    state,
    canUndo,
    createTask,
    updateTask,
    deleteTask,
    undoLastBatch
  }
} 