import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import { createPinia } from 'pinia'
import App from '../src/App.vue'

describe('App.vue with Testing Library', () => {
  const renderApp = () => {
    return render(App, {
      global: {
        plugins: [createPinia()]
      }
    })
  }

  it('renders welcome message', async () => {
    renderApp()
    expect(screen.getByText(/Hello from Vue 3/i)).toBeInTheDocument()
  })

  it('updates counter on click', async () => {
    const { getByRole } = renderApp()
    const button = getByRole('button', { name: /increment/i })
    
    await fireEvent.click(button)
    expect(screen.getByText(/count is: 1/i)).toBeInTheDocument()
  })
}) 