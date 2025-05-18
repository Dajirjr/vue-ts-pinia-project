import { OpenAI } from 'openai'
import { defineEventHandler, createError, H3Event, readBody } from 'h3'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface PlannerRequest {
  prompt: string
  style: string
}

interface PlannerResponse {
  response: string
  tasks: Array<{
    title: string
    description: string
  }>
}

export default defineEventHandler(async (event: H3Event): Promise<PlannerResponse> => {
  try {
    const { prompt, style } = await readBody<PlannerRequest>(event)

    if (!prompt) {
      throw createError({
        statusCode: 400,
        message: 'Prompt is required',
      })
    }

    const systemPrompt = getSystemPrompt(style)
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const aiResponse = response.choices[0]?.message?.content || ''
    const tasks = extractTasks(aiResponse)

    return {
      response: aiResponse,
      tasks,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to generate plan',
    })
  }
})

function getSystemPrompt(style: string): string {
  const basePrompt = `You are an AI task planner assistant. Your goal is to help users organize their tasks and create effective plans. `

  switch (style.toLowerCase()) {
    case 'detailed':
      return basePrompt + `Provide detailed explanations and break down complex tasks into smaller, manageable steps. Include time estimates and priority levels for each task.`
    case 'concise':
      return basePrompt + `Keep responses brief and to the point. Focus on key actions and deliverables.`
    case 'timeline':
      return basePrompt + `Organize tasks chronologically and suggest specific time blocks for each activity. Consider dependencies between tasks.`
    default:
      return basePrompt + `Provide a balanced mix of detail and brevity. Focus on practical, actionable items.`
  }
}

function extractTasks(response: string): Array<{ title: string; description: string }> {
  const tasks: Array<{ title: string; description: string }> = []
  
  // Look for tasks in bullet points or numbered lists
  const lines = response.split('\n')
  let currentTask: { title: string; description: string } | null = null

  for (const line of lines) {
    // Check for bullet points or numbers at the start of the line
    const taskMatch = line.match(/^[\s-]*(\d+\.|\*|\-|\•)\s+(.+)/)
    if (taskMatch) {
      // If we found a new task and had a previous one, save it
      if (currentTask) {
        tasks.push(currentTask)
      }
      // Start a new task
      currentTask = {
        title: taskMatch[2].trim(),
        description: '',
      }
    } else if (currentTask && line.trim()) {
      // If we have a current task and the line isn't empty, add to its description
      currentTask.description += (currentTask.description ? '\n' : '') + line.trim()
    }
  }

  // Don't forget to add the last task if we have one
  if (currentTask) {
    tasks.push(currentTask)
  }

  return tasks
} 