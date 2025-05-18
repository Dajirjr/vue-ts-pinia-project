import { App } from 'vue'
import Toast from '@/components/ui/Toast.vue'

export const ToastPlugin = {
  install: (app: App) => {
    // Register Toast component globally
    app.component('Toast', Toast)

    // Mount Toast container
    const toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)

    const toastInstance = createApp(Toast).mount(toastContainer)

    // Add toast methods to global properties
    app.config.globalProperties.$toast = {
      show: (message: string, type?: 'success' | 'error' | 'warning' | 'info', timeout?: number) => {
        toastInstance.show(message, type, timeout)
      },
      success: (message: string) => toastInstance.success(message),
      error: (message: string) => toastInstance.error(message),
      warning: (message: string) => toastInstance.warning(message),
      info: (message: string) => toastInstance.info(message)
    }
  }
} 