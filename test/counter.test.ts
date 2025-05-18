import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../src/stores/counter'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('Counter Store', () => {
  setActivePinia(createPinia())

  it('increments count', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    counter.increment()
    expect(counter.count).toBe(1)
  })
})

describe('App.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.text()).toContain('Hello from Vue 3')
  })
})