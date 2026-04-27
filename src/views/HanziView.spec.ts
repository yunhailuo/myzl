import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HanziView from './HanziView.vue'
import { useHanziStore } from '../stores/hanzi'

// Mock HanziWriter
vi.mock('hanzi-writer', () => {
  return {
    default: {
      create: vi.fn(() => ({
        setCharacter: vi.fn(),
        animateCharacter: vi.fn(),
        loopCharacterAnimation: vi.fn(),
      })),
    },
  }
})

// Mock cnchar
vi.mock('cnchar', () => ({
  default: {
    words: vi.fn(() => ['汉字', '文字', '字体']),
  },
}))

// Mock pinyin-pro
vi.mock('pinyin-pro', () => ({
  pinyin: vi.fn((char) => {
    const pinyinMap: Record<string, string> = {
      汉: 'hàn',
      字: 'zì',
      文: 'wén',
    }
    return pinyinMap[char] || 'test'
  }),
}))

describe('HanziView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())

    wrapper = mount(HanziView, {
      global: {
        stubs: {
          'hanzi-writer': true,
        },
      },
    })
  })

  describe('basic rendering', () => {
    it('renders the game component', () => {
      expect(wrapper.find('.game').exists()).toBe(true)
    })

    it('displays the counter', () => {
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })

    it('has hanzi container and config button', () => {
      expect(wrapper.find('#hanzi-container').exists()).toBe(true)
      expect(wrapper.findAll('.config-btn')).toHaveLength(1)
    })
  })

  describe('navigation buttons', () => {
    it('has navigation buttons when enabled', () => {
      expect(wrapper.findAll('.nav-btn')).toHaveLength(2)
    })

    it('disables left button on first character', () => {
      const leftButton = wrapper.find('.nav-btn.left')
      expect(leftButton.attributes('disabled')).toBeDefined()
    })

    it('hides navigation buttons when disabled', async () => {
      await wrapper.find('[data-testid="toggle-arrows"]').setValue(false)
      expect(wrapper.findAll('.nav-btn')).toHaveLength(0)
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

      // Open again and close via overlay
      await configBtn.trigger('click')
      await wrapper.find('.config-overlay').trigger('click')
      expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    })

    it('shows all configuration options', async () => {
      await wrapper.find('.config-btn').trigger('click')

      expect(wrapper.find('[data-testid="toggle-arrows"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-navigation"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-pinyin"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-words"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-loop"]').exists()).toBe(true)
    })
  })

  describe('character sets selection', () => {
    it('has collapsible character sets section with select all', async () => {
      await wrapper.find('.config-btn').trigger('click')

      expect(wrapper.find('.section-header.collapsible').exists()).toBe(true)
      
      const header = wrapper.find('.section-header.collapsible')
      await header.trigger('click')

      expect(wrapper.find('.set-list').exists()).toBe(true)
      expect(wrapper.find('.select-all-btn').exists()).toBe(true)
      
      const setItems = wrapper.findAll('.set-item')
      expect(setItems.length).toBeGreaterThan(0)
    })
  })

  describe('pinyin display', () => {
    it('shows pinyin with mask by default', () => {
      expect(wrapper.find('.pinyin-container').exists()).toBe(true)
      expect(wrapper.find('.pinyin-mask').exists()).toBe(true)
      expect(wrapper.find('.pinyin-display').classes()).toContain('hidden')
    })

    it('toggles pinyin visibility when clicked', async () => {
      await wrapper.find('.pinyin-container').trigger('click')

      expect(wrapper.find('.pinyin-mask').exists()).toBe(false)
      expect(wrapper.find('.pinyin-display').classes()).not.toContain('hidden')
    })

    it('hides pinyin when toggle is unchecked', async () => {
      await wrapper.find('[data-testid="toggle-pinyin"]').setValue(false)
      expect(wrapper.find('.pinyin-container').exists()).toBe(false)
    })
  })

  describe('word groups display', () => {
    it('shows word groups with mask by default', () => {
      expect(wrapper.find('.word-groups-container').exists()).toBe(true)
      expect(wrapper.find('.word-groups-mask').exists()).toBe(true)
    })

    it('toggles words visibility when clicked', async () => {
      await wrapper.find('.word-groups-container').trigger('click')
      expect(wrapper.find('.word-groups-mask').exists()).toBe(false)
    })

    it('hides words when toggle is unchecked', async () => {
      await wrapper.find('[data-testid="toggle-words"]').setValue(false)
      expect(wrapper.find('.word-groups-container').exists()).toBe(false)
    })
  })

  describe('reshuffle functionality', () => {
    it('has reshuffle button and calls store method', async () => {
      const store = useHanziStore()
      const reshuffleSpy = vi.spyOn(store, 'reshuffleCharacters')

      const reshuffleBtn = wrapper.find('.reshuffle-btn')
      expect(reshuffleBtn.exists()).toBe(true)
      
      await reshuffleBtn.trigger('click')
      expect(reshuffleSpy).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('navigates with arrow keys when enabled', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 2 个')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })

    it('does not respond to keyboard when navigation is disabled', async () => {
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(false)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })
  })

  describe('touch navigation', () => {
    const simulateSwipe = (startX: number, endX: number) => {
      document.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ identifier: 1, clientX: startX, clientY: 100 } as Touch],
        }),
      )
      document.dispatchEvent(
        new TouchEvent('touchend', {
          changedTouches: [{ identifier: 1, clientX: endX, clientY: 100 } as Touch],
        }),
      )
    }

    it('navigates with swipe gestures when enabled', async () => {
      // Swipe left (forward)
      simulateSwipe(180, 80)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 2 个')

      // Swipe right (backward)
      simulateSwipe(80, 180)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })

    it('ignores swipe when navigation is disabled or swipe is too small', async () => {
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(false)
      simulateSwipe(180, 80)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 个')

      // Re-enable and test small swipe
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(true)
      simulateSwipe(100, 90) // Only 10px difference
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })
  })

  describe('mask reset on navigation', () => {
    it('resets masks when navigating to next character', async () => {
      // Reveal both pinyin and words
      await wrapper.find('.pinyin-container').trigger('click')
      await wrapper.find('.word-groups-container').trigger('click')
      
      expect(wrapper.find('.pinyin-mask').exists()).toBe(false)
      expect(wrapper.find('.word-groups-mask').exists()).toBe(false)

      // Navigate to next
      await wrapper.find('.nav-btn.right').trigger('click')
      await wrapper.vm.$nextTick()

      // Both masks should be reset
      expect(wrapper.find('.pinyin-mask').exists()).toBe(true)
      expect(wrapper.find('.word-groups-mask').exists()).toBe(true)
    })
  })

  describe('loop animation toggle', () => {
    it('updates loop animation setting', async () => {
      const loopToggle = wrapper.find('[data-testid="toggle-loop"]')
      await loopToggle.setValue(false)

      const inputElement = loopToggle.element as HTMLInputElement
      expect(inputElement.checked).toBe(false)
    })
  })
})
