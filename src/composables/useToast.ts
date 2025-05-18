import { getCurrentInstance } from 'vue'

export function useToast() {
  const app = getCurrentInstance()
  if (!app) {
    throw new Error('useToast must be called within a component setup')
  }

  return {
    show: (message: string, type?: 'success' | 'error' | 'warning' | 'info', timeout?: number) => {
      app.appContext.config.globalProperties.$toast.show(message, type, timeout)
    },
    success: (message: string) => {
      app.appContext.config.globalProperties.$toast.success(message)
    },
    error: (message: string) => {
      app.appContext.config.globalProperties.$toast.error(message)
    },
    warning: (message: string) => {
      app.appContext.config.globalProperties.$toast.warning(message)
    },
    info: (message: string) => {
      app.appContext.config.globalProperties.$toast.info(message)
    }
  }
} 