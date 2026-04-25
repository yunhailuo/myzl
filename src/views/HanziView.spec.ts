import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HanziView from './HanziView.vue'

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

  it('renders the game component', () => {
    expect(wrapper.find('.game').exists()).toBe(true)
  })

  it('displays the counter', () => {
    expect(wrapper.find('.counter').text()).toContain('第 1 个')
  })

  it('has hanzi container for character display', () => {
    expect(wrapper.find('#hanzi-container').exists()).toBe(true)
  })

  it('has config button', () => {
    expect(wrapper.findAll('.config-btn')).toHaveLength(2)
  })

  describe('navigation buttons', () => {
    it('has left and right navigation buttons when enabled', () => {
      expect(wrapper.findAll('.nav-bar')).toHaveLength(2)
    })

    it('disables left button on first character', () => {
      const leftButton = wrapper.find('.nav-bar.left')
      expect(leftButton.attributes('disabled')).toBeDefined()
    })

    it('hides navigation buttons when disabled', async () => {
      await wrapper.find('[data-testid="toggle-arrows"]').setValue(false)
      expect(wrapper.findAll('.nav-bar')).toHaveLength(0)
    })
  })

  describe('config panel', () => {
    it('opens config panel when settings button is clicked', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')

      expect(wrapper.find('.config-panel').classes()).toContain('open')
      expect(wrapper.find('.config-overlay').classes()).toContain('active')
    })

    it('closes config panel when close button is clicked', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')
      await wrapper.find('.close-btn').trigger('click')

      expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    })

    it('closes config panel when overlay is clicked', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')
      await wrapper.find('.config-overlay').trigger('click')

      expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    })

    it('shows all configuration options', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')

      expect(wrapper.find('[data-testid="toggle-arrows"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-navigation"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-pinyin"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-words"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="toggle-loop"]').exists()).toBe(true)
    })
  })

  describe('character sets selection', () => {
    it('has collapsible character sets section', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')

      expect(wrapper.find('.section-header.collapsible').exists()).toBe(true)
    })

    it('toggles character sets visibility', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')

      const header = wrapper.find('.section-header.collapsible')
      await header.trigger('click')

      // Should expand/collapse (v-show toggles display)
      expect(wrapper.find('.set-list').exists()).toBe(true)
    })

    it('has select all button', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')
      const header = wrapper.find('.section-header.collapsible')
      await header.trigger('click')

      expect(wrapper.find('.select-all-btn').exists()).toBe(true)
    })

    it('lists available character sets', async () => {
      const configBtn = wrapper.findAll('.config-btn')[1]
      await configBtn?.trigger('click')
      const header = wrapper.find('.section-header.collapsible')
      await header.trigger('click')

      const setItems = wrapper.findAll('.set-item')
      expect(setItems.length).toBeGreaterThan(0)
    })
  })

  describe('pinyin display', () => {
    it('shows pinyin container when enabled', () => {
      expect(wrapper.find('.pinyin-container').exists()).toBe(true)
    })

    it('hides pinyin by default with mask', () => {
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
    it('shows word groups container when enabled', () => {
      expect(wrapper.find('.word-groups-container').exists()).toBe(true)
    })

    it('hides words by default with mask', () => {
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
    it('has reshuffle button', () => {
      const reshuffleBtn = wrapper.findAll('.config-btn')[0]
      expect(reshuffleBtn?.exists()).toBe(true)
    })

    it('calls reshuffle when button is clicked', async () => {
      const reshuffleBtn = wrapper.findAll('.config-btn')[0]
      await reshuffleBtn?.trigger('click')

      // After reshuffle, should still be on first character
      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })
  })

  describe('keyboard navigation', () => {
    it('moves to next character with ArrowRight', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.counter').text()).toContain('第 2 个')
    })

    it('moves to previous character with ArrowLeft', async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await wrapper.vm.$nextTick()
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

    it('moves to next character on swipe left', async () => {
      simulateSwipe(180, 80)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.counter').text()).toContain('第 2 个')
    })

    it('moves to previous character on swipe right', async () => {
      simulateSwipe(180, 80) // First go forward
      await wrapper.vm.$nextTick()
      simulateSwipe(80, 180) // Then go back
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })

    it('ignores swipe when navigation is disabled', async () => {
      await wrapper.find('[data-testid="toggle-navigation"]').setValue(false)
      simulateSwipe(180, 80)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })

    it('ignores small swipes below threshold', async () => {
      simulateSwipe(100, 90) // Only 10px difference
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.counter').text()).toContain('第 1 个')
    })
  })

  describe('mask reset on navigation', () => {
    it('resets pinyin mask when navigating to next character', async () => {
      // First reveal pinyin
      await wrapper.find('.pinyin-container').trigger('click')
      expect(wrapper.find('.pinyin-mask').exists()).toBe(false)

      // Navigate to next
      await wrapper.find('.nav-bar.right').trigger('click')
      await wrapper.vm.$nextTick()

      // Mask should be reset
      expect(wrapper.find('.pinyin-mask').exists()).toBe(true)
    })

    it('resets words mask when navigating to next character', async () => {
      // First reveal words
      await wrapper.find('.word-groups-container').trigger('click')
      expect(wrapper.find('.word-groups-mask').exists()).toBe(false)

      // Navigate to next
      await wrapper.find('.nav-bar.right').trigger('click')
      await wrapper.vm.$nextTick()

      // Mask should be reset
      expect(wrapper.find('.word-groups-mask').exists()).toBe(true)
    })
  })

  describe('loop animation toggle', () => {
    it('updates animation when loop toggle changes', async () => {
      const loopToggle = wrapper.find('[data-testid="toggle-loop"]')
      await loopToggle.setValue(false)

      const inputElement = loopToggle.element as HTMLInputElement
      expect(inputElement.checked).toBe(false)
    })
  })
})
