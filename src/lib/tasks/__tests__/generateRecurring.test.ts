import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecurringTasks, shouldRegenerateTask, getNextOccurrence } from '../generateRecurring'
import { addDays, addWeeks, addMonths, subDays } from 'date-fns'
import type { Task } from '@/types/task'

// Mock Supabase client
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        neq: () => ({
          returns: () => ({
            data: [],
            error: null
          })
        })
      })
    }),
    insert: () => ({
      error: null
    })
  })
}

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('Recurring Tasks', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: new Date().toISOString(),
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user1',
    recurrence: 'daily' as const,
    recurrence_end_date: null
  }

  describe('generateRecurringTasks', () => {
    it('should handle empty task list', async () => {
      await expect(generateRecurringTasks('user1')).resolves.not.toThrow()
    })

    it('should handle database errors', async () => {
      // Mock database error
      const errorMock = {
        from: () => ({
          select: () => ({
            eq: () => ({
              neq: () => ({
                returns: () => ({
                  data: null,
                  error: new Error('Database error')
                })
              })
            })
          }),
          insert: () => ({
            error: null
          })
        })
      }

      vi.spyOn(mockSupabase, 'from').mockImplementation(errorMock.from)
      await expect(generateRecurringTasks('user1')).rejects.toThrow('Database error')
    })

    it('should skip tasks without due date', async () => {
      const taskWithoutDueDate = { ...mockTask, dueDate: undefined }
      const skipMock = {
        from: () => ({
          select: () => ({
            eq: () => ({
              neq: () => ({
                returns: () => ({
                  data: [taskWithoutDueDate],
                  error: null
                })
              })
            })
          }),
          insert: () => ({
            error: null
          })
        })
      }

      vi.spyOn(mockSupabase, 'from').mockImplementation(skipMock.from)
      await expect(generateRecurringTasks('user1')).resolves.not.toThrow()
    })
  })

  describe('shouldRegenerateTask', () => {
    it('should return false for non-recurring tasks', () => {
      const task = { ...mockTask, recurrence: 'none' as const }
      expect(shouldRegenerateTask(task)).toBe(false)
    })

    it('should return false for incomplete tasks', () => {
      const task = { ...mockTask, completed: false }
      expect(shouldRegenerateTask(task)).toBe(false)
    })

    it('should return false for future tasks', () => {
      const task = { 
        ...mockTask,
        completed: true,
        dueDate: addDays(new Date(), 1).toISOString()
      }
      expect(shouldRegenerateTask(task)).toBe(false)
    })

    it('should return false for tasks beyond end date', () => {
      const task = {
        ...mockTask,
        completed: true,
        dueDate: subDays(new Date(), 1).toISOString(),
        recurrence_end_date: subDays(new Date(), 2).toISOString()
      }
      expect(shouldRegenerateTask(task)).toBe(false)
    })

    it('should return true for completed tasks due in the past', () => {
      const task = {
        ...mockTask,
        completed: true,
        dueDate: subDays(new Date(), 1).toISOString()
      }
      expect(shouldRegenerateTask(task)).toBe(true)
    })
  })

  describe('getNextOccurrence', () => {
    const baseDate = new Date(2024, 0, 1) // January 1, 2024

    it('should return null for non-recurring tasks', () => {
      expect(getNextOccurrence(baseDate, 'none')).toBeNull()
    })

    it('should calculate next daily occurrence', () => {
      const expected = addDays(baseDate, 1)
      expect(getNextOccurrence(baseDate, 'daily')).toEqual(expected)
    })

    it('should calculate next weekly occurrence', () => {
      const expected = addWeeks(baseDate, 1)
      expect(getNextOccurrence(baseDate, 'weekly')).toEqual(expected)
    })

    it('should calculate next monthly occurrence', () => {
      const expected = addMonths(baseDate, 1)
      expect(getNextOccurrence(baseDate, 'monthly')).toEqual(expected)
    })

    it('should respect end date', () => {
      const endDate = addDays(baseDate, 1).toISOString()
      expect(getNextOccurrence(baseDate, 'weekly', endDate)).toBeNull()
    })
  })
}) 