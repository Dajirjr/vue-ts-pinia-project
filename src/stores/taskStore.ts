import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, PomodoroSession, CreateTaskData } from '@/types/task'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const todoTasks = computed(() => tasks.value.filter(task => task.status === 'todo'))
  const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in-progress'))
  const doneTasks = computed(() => tasks.value.filter(task => task.status === 'done'))
  
  const weeklyStats = computed(() => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return tasks.value.reduce((stats, task) => {
      const taskDate = new Date(task.updatedAt)
      if (taskDate >= oneWeekAgo && task.status === 'done') {
        const day = taskDate.toLocaleDateString('en-US', { weekday: 'short' })
        stats[day] = (stats[day] || 0) + 1
      }
      return stats
    }, {} as Record<string, number>)
  })

  // Optimistic update methods
  function addTask(task: Task) {
    tasks.value.unshift(task)
  }

  function updateTaskOptimistic(task: Task) {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...task }
    }
  }

  function removeTaskOptimistic(taskId: string) {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  // Server actions
  async function fetchTasks() {
    try {
      isLoading.value = true
      const { data, error: err } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      tasks.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(taskData: CreateTaskData) {
    try {
      isLoading.value = true
      const { data, error: err } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (err) throw err
      if (data) {
        tasks.value.unshift(data[0])
      }
      return data?.[0]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    try {
      isLoading.value = true
      const { data, error: err } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()

      if (err) throw err
      if (data) {
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...data[0] }
        }
      }
      return data?.[0]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(taskId: string) {
    try {
      isLoading.value = true
      const { error: err } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (err) throw err
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function addPomodoroSession(taskId: string, session: Omit<PomodoroSession, 'taskId'>) {
    try {
      const task = tasks.value.find(t => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const updatedSessions = [...(task.pomodoroSessions || []), { ...session, taskId }]
      await updateTask(taskId, { pomodoroSessions: updatedSessions })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add pomodoro session'
      throw error.value
    }
  }

  return {
    // State
    tasks,
    isLoading,
    error,
    
    // Computed
    todoTasks,
    inProgressTasks,
    doneTasks,
    weeklyStats,
    
    // Optimistic updates
    addTask,
    updateTaskOptimistic,
    removeTaskOptimistic,
    
    // Server actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    addPomodoroSession,
  }
}) 