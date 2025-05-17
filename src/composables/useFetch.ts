import { ref } from 'vue'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface FetchState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useFetch<T>() {
  const state = ref<FetchState<T>>({
    data: null,
    error: null,
    loading: false
  })

  const execute = async (url: string, options?: RequestInit): Promise<void> => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      state.value.data = data
    } catch (error) {
      state.value.error = error instanceof Error ? error : new Error('An error occurred')
      console.error('Fetch error:', error)
    } finally {
      state.value.loading = false
    }
  }

  return {
    ...state.value,
    execute
  }
}

// Example usage for posts
export function useFetchDocuments() {
  const { data, error, loading, execute } = useFetch<Post[]>()

  const fetchPosts = () => {
    return execute('https://jsonplaceholder.typicode.com/posts')
  }

  return {
    posts: data,
    error,
    loading,
    fetchPosts
  }
}

// Example usage for a single post
export function useFetchDocument(id: number) {
  const { data, error, loading, execute } = useFetch<Post>()

  const fetchPost = () => {
    return execute(`https://jsonplaceholder.typicode.com/posts/${id}`)
  }

  return {
    post: data,
    error,
    loading,
    fetchPost
  }
} 