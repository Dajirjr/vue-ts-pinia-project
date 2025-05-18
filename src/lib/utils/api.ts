/**
 * Utility functions for API calls
 */

/**
 * Executes a function with exponential backoff retry
 */
export async function withRetry<T>(
  requestFn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn()
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries reached')
}

/**
 * Fetches all pages of paginated results
 */
export async function fetchAllPages<T>(
  fetchPage: (pageToken?: string) => Promise<{ items: T[], nextPageToken?: string }>
): Promise<T[]> {
  const results: T[] = []
  let pageToken: string | undefined

  do {
    const data = await withRetry(() => fetchPage(pageToken))
    results.push(...data.items)
    pageToken = data.nextPageToken
  } while (pageToken)

  return results
} 