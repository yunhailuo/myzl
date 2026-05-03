import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import BatchView from './BatchView.vue'

// Mock the dynamic import
vi.mock('../stores/additionSubtraction.ts', () => ({
  generateProblem: vi.fn(() => '5 + 3 = '),
  createBatchGenerator: vi.fn(() => vi.fn(() => '5 + 3 = ')),
}))

describe('BatchView.vue', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/:game/batch',
          name: 'batch',
          component: BatchView,
        },
      ],
    })

    router.push('/addition-subtraction/batch?count=5&columns=2')
  })

  it('renders loading state initially', async () => {
    await router.isReady()
    const wrapper = mount(BatchView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('displays questions after generation', async () => {
    await router.isReady()
    const wrapper = mount(BatchView, {
      global: {
        plugins: [router],
      },
    })

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.questions-container').exists()).toBe(true)
    expect(wrapper.findAll('.question-item')).toHaveLength(5)
  })

  it('applies correct column layout from URL parameters', async () => {
    await router.isReady()
    const wrapper = mount(BatchView, {
      global: {
        plugins: [router],
      },
    })

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    const container = wrapper.find('.questions-container')
    expect(container.exists()).toBe(true)
    expect(container.attributes('style')).toContain('grid-template-columns: repeat(2, 1fr)')
  })
})
