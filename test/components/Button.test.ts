import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import { createPinia } from 'pinia'
import App from '../../src/App.vue'

describe('Button Component', () => {
  const renderButton = () => {
    return render(App, {
      global: {
        plugins: [createPinia()]
      }
    })
  }

  it('has correct initial state', () => {
    renderButton()
    const button = screen.getByRole('button', { name: /increment/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('count is: 0')
  })

  it('is clickable and updates count', async () => {
    renderButton()
    const button = screen.getByRole('button', { name: /increment/i })
    
    await fireEvent.click(button)
    expect(button).toHaveTextContent('count is: 1')
    
    await fireEvent.click(button)
    expect(button).toHaveTextContent('count is: 2')
  })

  it('has correct styling classes', () => {
    renderButton()
    const button = screen.getByRole('button', { name: /increment/i })
    
    // Check for presence of button in the card container
    expect(button.parentElement).toHaveClass('card')
    
    // Verify button attributes
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'increment')
  })
}) 