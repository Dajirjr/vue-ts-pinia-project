export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type PomodoroSession = {
  taskId: string
  startTime: string
  endTime: string
  duration: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId: string
  tags?: string[]
  pomodoroSessions?: PomodoroSession[]
}

export type TaskPriority = Task['priority']

export interface TaskAction {
  type: 'create' | 'update' | 'delete'
  task: Task
  previousState?: Task
  timestamp: number
  batchId?: string
}

export interface BatchOperation {
  id: string
  actions: TaskAction[]
  timestamp: number
  undoable: boolean
}

export interface TaskActionState {
  loading: boolean
  error: Error | null
  currentBatch: BatchOperation | null
  history: BatchOperation[]
}

export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> 