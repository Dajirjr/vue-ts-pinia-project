import type { WeeklyStats } from './generateWeeklyReport'
import { format } from 'date-fns'

interface TaskTrend {
  trend: 'increasing' | 'decreasing' | 'stable'
  percentage: number
}

interface DailyTaskCount {
  day: string
  count: number
}

function calculateTaskTrend(stats: WeeklyStats): TaskTrend {
  const dailyTasks = Object.entries(stats.byDay)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([_, count]) => count)

  if (dailyTasks.length < 2) {
    return { trend: 'stable', percentage: 0 }
  }

  const firstHalf = dailyTasks.slice(0, Math.floor(dailyTasks.length / 2))
  const secondHalf = dailyTasks.slice(Math.floor(dailyTasks.length / 2))

  const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

  const changePercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

  return {
    trend: changePercentage > 5 ? 'increasing' : changePercentage < -5 ? 'decreasing' : 'stable',
    percentage: Math.abs(changePercentage)
  }
}

function getProductivityInsights(stats: WeeklyStats): string {
  const trend = calculateTaskTrend(stats)
  const totalTasks = stats.completed + stats.inProgress
  const completionRate = totalTasks ? (stats.completed / totalTasks) * 100 : 0
  const focusHours = Math.floor(stats.focusMinutes / 60)
  const focusMinutes = stats.focusMinutes % 60

  const insights = []

  // Productivity trend
  if (trend.trend !== 'stable') {
    insights.push(
      `Task completion has been ${trend.trend} this week (${Math.round(trend.percentage)}% ${trend.trend === 'increasing' ? 'up' : 'down'}).`
    )
  }

  // Focus time analysis
  if (stats.focusMinutes > 0) {
    const avgFocusPerTask = Math.round(stats.focusMinutes / totalTasks)
    insights.push(
      `You've spent ${focusHours}h ${focusMinutes}m in focused work, averaging ${avgFocusPerTask} minutes per task.`
    )
  }

  // Priority distribution analysis
  const highPriorityCompletion = `${Math.round((stats.byPriority.high / totalTasks) * 100)}%`
  insights.push(
    `High-priority tasks make up ${highPriorityCompletion} of your workload.`
  )

  // Peak productivity days
  const peakDay = Object.entries(stats.byDay)
    .sort(([, a], [, b]) => b - a)[0] as [string, number] | undefined
  if (peakDay) {
    insights.push(
      `Your most productive day was ${peakDay[0]} with ${peakDay[1]} tasks.`
    )
  }

  return insights.join(' ')
}

export function generateWeeklyReportPrompt(stats: WeeklyStats): string {
  const insights = getProductivityInsights(stats)
  const weekStart = new Date(stats.weekStart)
  const weekEnd = new Date(stats.weekEnd)

  return `You are an AI productivity coach analyzing a user's weekly task performance. Use the following data to provide specific, actionable insights:

Key Metrics (Week of ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}):

1. Task Completion:
   - Completed: ${stats.completed} tasks
   - In Progress: ${stats.inProgress} tasks
   - Completion Rate: ${Math.round((stats.completed / (stats.completed + stats.inProgress)) * 100)}%

2. Focus Time:
   - Total: ${Math.floor(stats.focusMinutes / 60)}h ${stats.focusMinutes % 60}m
   - Average per day: ${Math.round(stats.focusMinutes / 7)}m

3. Priority Distribution:
   High: ${stats.byPriority.high} tasks
   Medium: ${stats.byPriority.medium} tasks
   Low: ${stats.byPriority.low} tasks

4. Daily Activity Pattern:
${Object.entries(stats.byDay)
  .map(([day, count]) => `   ${day}: ${count} tasks`)
  .join('\n')}

Initial Analysis:
${insights}

Please provide a comprehensive report with:

1. Key Achievements:
   - Highlight the most significant accomplishments
   - Note any improvements in productivity patterns
   - Identify successful work habits

2. Areas for Optimization:
   - Suggest specific improvements based on task distribution
   - Identify potential bottlenecks or inefficiencies
   - Recommend priority management adjustments if needed

3. Strategic Recommendations:
   - Provide 2-3 actionable steps for next week
   - Suggest specific time management techniques based on the focus time data
   - Recommend priority balancing if needed

4. Motivational Insight:
   - End with an encouraging note that references specific achievements
   - Provide a clear, actionable focus for the coming week

Keep the tone professional but encouraging, and ensure all suggestions are specific and actionable based on the data provided.`
} 