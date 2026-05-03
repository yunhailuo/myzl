import { beforeEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdditionSubtractionView from './AdditionSubtractionView.vue'
import { useAdditionSubtractionStore } from '../stores/additionSubtraction'

const swipeLeft = async () => {
  document.dispatchEvent(
    new TouchEvent('touchstart', {
      touches: [{ identifier: 1, clientX: 180, clientY: 100 } as Touch],
    }),
  )
  document.dispatchEvent(
    new TouchEvent('touchend', {
      changedTouches: [{ identifier: 1, clientX: 80, clientY: 100 } as Touch],
    }),
  )
}

const swipeRight = async () => {
  document.dispatchEvent(
    new TouchEvent('touchstart', {
      touches: [{ identifier: 1, clientX: 80, clientY: 100 } as Touch],
    }),
  )
  document.dispatchEvent(
    new TouchEvent('touchend', {
      changedTouches: [{ identifier: 1, clientX: 180, clientY: 100 } as Touch],
    }),
  )
}

describe('AdditionSubtractionView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(AdditionSubtractionView)
  })

  describe('basic rendering', () => {
    it('renders the game with counter and question', () => {
      expect(wrapper.find('.game').exists()).toBe(true)
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
      expect(wrapper.find('.expression').text()).toMatch(/^\d+ [+-] \d+ =$/)
    })

    it('has navigation buttons with proper state', () => {
      const buttons = wrapper.findAll('.nav-btn')
      expect(buttons).toHaveLength(2)

      expect(wrapper.find('.nav-btn.left').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.nav-btn.right').attributes('disabled')).toBeUndefined()
    })
  })

  describe('navigation', () => {
    it('navigates between questions with buttons', async () => {
      await wrapper.find('.nav-btn.right').trigger('click')
      expect(wrapper.find('.counter').text()).toContain('第 2 题')

      await wrapper.find('.nav-btn.left').trigger('click')
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })

    it('maintains question history when navigating back and forth', async () => {
      await wrapper.find('.nav-btn.right').trigger('click')
      await wrapper.find('.nav-btn.right').trigger('click')
      const questionAt3 = wrapper.find('.expression').text()

      await wrapper.find('.nav-btn.left').trigger('click')
      await wrapper.find('.nav-btn.left').trigger('click')
      await wrapper.find('.nav-btn.right').trigger('click')
      await wrapper.find('.nav-btn.right').trigger('click')

      expect(wrapper.find('.expression').text()).toBe(questionAt3)
    })
  })

  describe('config panel', () => {
    it('opens and closes config panel', async () => {
      const configBtn = wrapper.find('.config-btn')

      // Open
      await configBtn.trigger('click')
      expect(wrapper.find('.config-panel').classes()).toContain('open')
      expect(wrapper.find('.config-overlay').classes()).toContain('active')

      // Close via close button
      await wrapper.find('.close-btn').trigger('click')
      expect(wrapper.find('.config-panel').classes()).not.toContain('open')
      expect(wrapper.find('.config-overlay').classes()).not.toContain('active')

      // Open again and close via overlay
      await configBtn.trigger('click')
      await wrapper.find('.config-overlay').trigger('click')
      expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    })

    it('toggles arrow visibility with checkbox', async () => {
      const arrowCheckbox = wrapper.find('[data-testid="toggle-arrows"]')

      await arrowCheckbox.setValue(false)
      expect(wrapper.findAll('.nav-btn')).toHaveLength(0)
      expect(wrapper.find('.question-area').classes()).toContain('full-width')

      await arrowCheckbox.setValue(true)
      expect(wrapper.findAll('.nav-btn')).toHaveLength(2)
      expect(wrapper.find('.question-area').classes()).not.toContain('full-width')
    })
  })

  describe('keyboard navigation', () => {
    it('responds to arrow keys when enabled', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 2 题')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })

    it('ignores keyboard when navigation is disabled', async () => {
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(false)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })

    it('ignores irrelevant keyboard keys', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })
  })

  describe('touch navigation', () => {
    it('responds to swipe gestures when enabled', async () => {
      await swipeLeft()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 2 题')

      await swipeRight()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })

    it('ignores swipe when navigation is disabled or swipe is too small', async () => {
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(false)
      await swipeLeft()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')

      // Re-enable and test small swipe
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(true)
      document.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ identifier: 1, clientX: 100, clientY: 100 } as Touch],
        }),
      )
      document.dispatchEvent(
        new TouchEvent('touchend', {
          changedTouches: [{ identifier: 1, clientX: 90, clientY: 100 } as Touch],
        }),
      )
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 题')
    })
  })

  describe('question generation', () => {
    it('generates valid questions in range', async () => {
      // Test addition problems
      const store = useAdditionSubtractionStore()
      store.enableAddition = true
      store.enableSubtraction = false
      
      for (let i = 0; i < 15; i++) {
        await wrapper.find('.nav-btn.right').trigger('click')
        
        const questionText = wrapper.find('.expression').text()
        const match = questionText.match(/^(-?\d+(?:\.\d+)?|\(-?\d+(?:\.\d+)?\)) ([+-]) (-?\d+(?:\.\d+)?|\(-?\d+(?:\.\d+)?\)) =$/)
        
        expect(match).not.toBeNull()
        const num1Str = match![1]!
        const op = match![2]
        const num2Str = match![3]!
        
        // Remove parentheses for parsing
        const num1 = parseFloat(num1Str.replace(/[()]/g, ''))
        const num2 = parseFloat(num2Str.replace(/[()]/g, ''))
        
        // Addition: parts should be in [partMin, partMax], sum in [sumMin, sumMax]
        expect(op).toBe('+')
        expect(num1).toBeGreaterThanOrEqual(1)
        expect(num1).toBeLessThanOrEqual(10)
        expect(num2).toBeGreaterThanOrEqual(1)
        expect(num2).toBeLessThanOrEqual(10)
        const sum = num1 + num2
        expect(sum).toBeGreaterThanOrEqual(2)
        expect(sum).toBeLessThanOrEqual(20)
      }
      
      // Test subtraction problems
      store.enableAddition = false
      store.enableSubtraction = true
      
      // Generate new subtraction problem by calling next (which uses the updated settings)
      store.nextProblem()
      
      for (let i = 0; i < 15; i++) {
        await wrapper.find('.nav-btn.right').trigger('click')
        
        const questionText = wrapper.find('.expression').text()
        const match = questionText.match(/^(-?\d+(?:\.\d+)?|\(-?\d+(?:\.\d+)?\)) ([+-]) (-?\d+(?:\.\d+)?|\(-?\d+(?:\.\d+)?\)) =$/)
        
        expect(match).not.toBeNull()
        const num1Str = match![1]!
        const num2Str = match![3]!
        
        // Remove parentheses for parsing
        const num1 = parseFloat(num1Str.replace(/[()]/g, ''))
        const num2 = parseFloat(num2Str.replace(/[()]/g, ''))
        
        // Subtraction: minuend in [sumMin, sumMax], subtrahend/difference in [partMin, partMax]
        expect(num1).toBeGreaterThanOrEqual(2)
        expect(num1).toBeLessThanOrEqual(20)
        expect(num2).toBeGreaterThanOrEqual(1)
        expect(num2).toBeLessThanOrEqual(10)
      }
    })

    it('keeps subtraction questions non-negative by default', async () => {
      for (let i = 0; i < 30; i++) {
        await wrapper.find('.nav-btn.right').trigger('click')
      }

      const latest = wrapper
        .find('.expression')
        .text()
        .match(/^(\d+(?:\.\d+)?) ([+-]) (\d+(?:\.\d+)?) =$/)
      expect(latest).not.toBeNull()
      const isNonNegativeSubtraction = latest?.[2] !== '-' || Number(latest[1]) >= Number(latest[3])
      expect(isNonNegativeSubtraction).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('has proper aria labels on buttons', () => {
      const configBtn = wrapper.find('.config-btn')
      const leftBtn = wrapper.find('.nav-btn.left')
      const rightBtn = wrapper.find('.nav-btn.right')

      expect(configBtn.attributes('aria-label')).toBe('Settings')
      expect(leftBtn.attributes('aria-label')).toBe('Previous')
      expect(rightBtn.attributes('aria-label')).toBe('Next')
    })
  })
})
