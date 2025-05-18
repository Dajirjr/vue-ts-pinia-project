import { supabase } from '@/lib/supabase'
import { OpenAI } from 'openai'
import type { Task } from '@/types/task'
import { startOfWeek, endOfWeek, formatISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { generateWeeklyReportPrompt } from './promptTemplates'

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY })
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export interface WeeklyStats {
  completed: number
  inProgress: number
  focusMinutes: number
  weekStart: string
  weekEnd: string
  byPriority: {
    high: number
    medium: number
    low: number
  }
  byDay: Record<string, number>
}

interface PomodoroSession {
  duration: number
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function generateWeeklyReport(retryCount = 0): Promise<{ summary: string; stats: WeeklyStats }> {
  try {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // Calculate week boundaries in user's timezone
    const now = new Date()
    const zonedDate = toZonedTime(now, userTimezone)
    const weekStart = startOfWeek(zonedDate, { weekStartsOn: 1 }) // Start from Monday
    const weekEnd = endOfWeek(zonedDate, { weekStartsOn: 1 })

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('created_at', formatISO(weekStart))
      .lte('created_at', formatISO(weekEnd))

    if (error) {
      throw new Error(`Failed to fetch task data: ${error.message}`)
    }

    if (!tasks || tasks.length === 0) {
      return {
        summary: 'No tasks were recorded this week. Start by creating some tasks to get insights about your productivity!',
        stats: {
          completed: 0,
          inProgress: 0,
          focusMinutes: 0,
          weekStart: formatISO(weekStart),
          weekEnd: formatISO(weekEnd),
          byPriority: { high: 0, medium: 0, low: 0 },
          byDay: {}
        }
      }
    }

    // Calculate statistics
    const stats: WeeklyStats = {
      completed: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      focusMinutes: tasks.reduce((sum, t) => {
        if (!t.pomodoroSessions) return sum
        return sum + (t.pomodoroSessions as PomodoroSession[]).reduce((total: number, session: PomodoroSession) => total + session.duration, 0)
      }, 0),
      weekStart: formatISO(weekStart),
      weekEnd: formatISO(weekEnd),
      byPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      byDay: tasks.reduce((acc, task) => {
        const day = toZonedTime(new Date(task.created_at), userTimezone)
          .toLocaleDateString('en-US', { weekday: 'short' })
        acc[day] = (acc[day] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    try {
      // Generate the AI summary using the enhanced prompt
      const chat = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI productivity assistant that provides insightful and actionable feedback. Focus on patterns, achievements, and specific recommendations.' 
          },
          { 
            role: 'user', 
            content: generateWeeklyReportPrompt(stats)
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return {
        summary: chat.choices[0].message.content?.trim() || 'No summary generated.',
        stats
      }
    } catch (aiError: unknown) {
      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY * Math.pow(2, retryCount))
        return generateWeeklyReport(retryCount + 1)
      }
      throw new Error(`Failed to generate AI summary after ${MAX_RETRIES} retries: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`)
    }
  } catch (error: unknown) {
    throw new Error(`Weekly report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 