import type { Task } from '@/types/task'
import { withRetry, fetchAllPages } from '@/lib/utils/api'

interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  colorId?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  extendedProperties?: {
    shared?: {
      task_id?: string
    }
  }
}

interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[]
  nextPageToken?: string
}

/**
 * Maps task priority to Google Calendar color IDs
 */
function getColorIdForPriority(priority: Task['priority']): string {
  switch (priority) {
    case 'high':
      return '11' // Red
    case 'medium':
      return '5'  // Yellow
    case 'low':
      return '2'  // Green
    default:
      return '0'  // Default blue
  }
}

/**
 * Store Google token in Supabase user metadata
 */
export async function storeGoogleToken(
  accessToken: string,
  expiresIn: number,
  userToken: string
): Promise<void> {
  const response = await fetch('/functions/store-google-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: accessToken,
      expires_in: expiresIn
    })
  })

  if (!response.ok) {
    throw new Error('Failed to store Google token')
  }
}

/**
 * Fetches events from the specified Google Calendar
 */
export async function fetchGoogleCalendarEvents(
  accessToken: string,
  calendarId = 'primary'
): Promise<GoogleCalendarEvent[]> {
  const fetchPage = async (pageToken?: string): Promise<GoogleCalendarResponse> => {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`)
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(`Failed to fetch Google Calendar events: ${response.statusText}`)
    }

    return response.json()
  }

  return fetchAllPages(fetchPage)
}

/**
 * Creates a new event in Google Calendar from a task
 */
export async function createGoogleEvent(
  accessToken: string,
  task: Task,
  calendarId = 'primary'
): Promise<GoogleCalendarEvent> {
  if (!task.dueDate) {
    throw new Error('Task must have a due date to create a calendar event')
  }

  const dueDate = new Date(task.dueDate)
  const endDate = new Date(dueDate)
  endDate.setHours(endDate.getHours() + 1) // Default to 1-hour duration

  const event = {
    summary: task.title,
    description: task.description,
    colorId: getColorIdForPriority(task.priority),
    start: {
      dateTime: dueDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    extendedProperties: {
      shared: {
        task_id: task.id
      }
    }
  }

  const response = await withRetry<GoogleCalendarEvent>(async () => {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(`Failed to create Google Calendar event: ${res.statusText}`)
    }

    return res.json()
  })

  return response
}

/**
 * Updates an existing Google Calendar event
 */
export async function updateGoogleEvent(
  accessToken: string,
  eventId: string,
  task: Task,
  calendarId = 'primary'
): Promise<GoogleCalendarEvent> {
  if (!task.dueDate) {
    throw new Error('Task must have a due date to update calendar event')
  }

  const dueDate = new Date(task.dueDate)
  const endDate = new Date(dueDate)
  endDate.setHours(endDate.getHours() + 1)

  const event = {
    summary: task.title,
    description: task.description,
    colorId: getColorIdForPriority(task.priority),
    start: {
      dateTime: dueDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    extendedProperties: {
      shared: {
        task_id: task.id
      }
    }
  }

  const response = await withRetry<GoogleCalendarEvent>(async () => {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      throw new Error(`Failed to update Google Calendar event: ${res.statusText}`)
    }

    return res.json()
  })

  return response
}

/**
 * Checks if a task is already synced with Google Calendar
 */
export function isTaskSynced(events: GoogleCalendarEvent[], task: Task): boolean {
  return events.some(event => event.extendedProperties?.shared?.task_id === task.id)
}

/**
 * Gets the event ID for a synced task
 */
export function getEventIdForTask(events: GoogleCalendarEvent[], task: Task): string | null {
  const event = events.find(event => event.extendedProperties?.shared?.task_id === task.id)
  return event?.id || null
} 