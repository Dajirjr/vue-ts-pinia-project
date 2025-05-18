import { supabase } from '@/lib/supabase'
import { addDays, addWeeks, addMonths, isBefore, isAfter, startOfDay } from 'date-fns'
import type { Task } from '@/types/task'

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly'

interface RecurringTask extends Task {
  recurrence: RecurrenceType
  recurrence_end_date?: string | null
}

/**
 * Generate recurring tasks for a user
 * This should be called periodically (e.g., daily) to create upcoming recurring tasks
 */
export async function generateRecurringTasks(userId: string): Promise<void> {
  try {
    // Get all recurring tasks for the user
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .neq('recurrence', 'none')
      .returns<RecurringTask[]>()

    if (error) throw error
    if (!tasks?.length) return

    const now = startOfDay(new Date())
    const batch: Omit<RecurringTask, 'id'>[] = []

    for (const task of tasks) {
      if (!task.dueDate) continue // Skip tasks without due date

      const lastDate = startOfDay(new Date(task.dueDate))
      let nextDate = lastDate

      // Calculate next occurrence based on recurrence type
      switch (task.recurrence) {
        case 'daily':
          nextDate = addDays(lastDate, 1)
          break
        case 'weekly':
          nextDate = addWeeks(lastDate, 1)
          break
        case 'monthly':
          nextDate = addMonths(lastDate, 1)
          break
      }

      // Skip if next date is in the past (prevents backfilling)
      if (isBefore(nextDate, now)) continue

      // Skip if next date is beyond end date
      if (task.recurrence_end_date && isAfter(nextDate, new Date(task.recurrence_end_date))) {
        continue
      }

      // Prepare new task for batch insert
      const { id, ...taskWithoutId } = task
      const newTask: Omit<RecurringTask, 'id'> = {
        ...taskWithoutId,
        dueDate: nextDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false
      }

      batch.push(newTask)
    }

    // Insert all new tasks in a single batch
    if (batch.length > 0) {
      const { error: insertError } = await supabase
        .from('tasks')
        .insert(batch)

      if (insertError) throw insertError
    }
  } catch (error) {
    console.error('Failed to generate recurring tasks:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to generate recurring tasks: ${error.message}`
        : 'Failed to generate recurring tasks: Unknown error'
    )
  }
}

/**
 * Check if a task should be regenerated based on its recurrence settings
 */
export function shouldRegenerateTask(task: RecurringTask): boolean {
  if (task.recurrence === 'none' || !task.dueDate) return false

  const now = startOfDay(new Date())
  const dueDate = startOfDay(new Date(task.dueDate))

  // Don't regenerate if task is not completed
  if (!task.completed) return false

  // Don't regenerate if due date is in the future
  if (isAfter(dueDate, now)) return false

  // Don't regenerate if beyond end date
  if (task.recurrence_end_date && isAfter(now, new Date(task.recurrence_end_date))) {
    return false
  }

  return true
}

/**
 * Calculate the next occurrence date for a recurring task
 */
export function getNextOccurrence(
  currentDate: Date,
  recurrence: RecurrenceType,
  endDate?: string | null
): Date | null {
  if (recurrence === 'none') return null

  let nextDate: Date

  switch (recurrence) {
    case 'daily':
      nextDate = addDays(currentDate, 1)
      break
    case 'weekly':
      nextDate = addWeeks(currentDate, 1)
      break
    case 'monthly':
      nextDate = addMonths(currentDate, 1)
      break
    default:
      return null
  }

  if (endDate && isAfter(nextDate, new Date(endDate))) {
    return null
  }

  return nextDate
} 