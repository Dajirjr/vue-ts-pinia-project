import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/vue'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Configure Vue Test Utils
config.global.mocks = {
  // Add any global mocks here
}

// Configure Vitest globals
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Add custom matchers
expect.extend({
  toHaveBeenCalledOnce(received: any) {
    const pass = received.mock.calls.length === 1
    return {
      pass,
      message: () =>
        `Expected function to be called once but was called ${received.mock.calls.length} times`,
    }
  },
})

// Add any other test setup configuration here 