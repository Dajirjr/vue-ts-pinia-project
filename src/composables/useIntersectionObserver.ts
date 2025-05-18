import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const isIntersecting = ref(false)
  const target = ref(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
    }, {
      threshold: 0.1,
      ...options
    })

    if (target.value) {
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isIntersecting,
    target
  }
} 