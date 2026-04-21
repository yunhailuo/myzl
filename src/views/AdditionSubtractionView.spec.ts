import { beforeEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AdditionSubtractionView from './AdditionSubtractionView.vue'

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

describe('AdditionSubtractionView.vue', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(AdditionSubtractionView)
  })

  it('renders the game component', () => {
    expect(wrapper.find('.game').exists()).toBe(true)
  })

  it('displays the counter and a question', () => {
    expect(wrapper.find('.counter').text()).toContain('第 1 题')
    expect(wrapper.find('.question').text()).toMatch(/^\d+ [+-] \d+$/)
  })

  it('has left and right navigation buttons', () => {
    expect(wrapper.findAll('.nav-bar')).toHaveLength(2)
  })

  it('disables the left button on the first question', () => {
    expect(wrapper.find('.nav-bar.left').attributes('disabled')).toBeDefined()
  })

  it('navigates to the next and previous questions with buttons', async () => {
    await wrapper.find('.nav-bar.right').trigger('click')
    expect(wrapper.find('.counter').text()).toContain('第 2 题')

    await wrapper.find('.nav-bar.left').trigger('click')
    expect(wrapper.find('.counter').text()).toContain('第 1 题')
  })

  it('opens and closes the config panel', async () => {
    const configBtn = wrapper.find('.config-btn')

    await configBtn.trigger('click')
    expect(wrapper.find('.config-panel').classes()).toContain('open')
    expect(wrapper.find('.config-overlay').classes()).toContain('active')

    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.find('.config-panel').classes()).not.toContain('open')
    expect(wrapper.find('.config-overlay').classes()).not.toContain('active')
  })

  it('closes the config panel when the overlay is clicked', async () => {
    await wrapper.find('.config-btn').trigger('click')
    await wrapper.find('.config-overlay').trigger('click')

    expect(wrapper.find('.config-panel').classes()).not.toContain('open')
  })

  it('toggles arrow visibility with the arrow checkbox', async () => {
    const arrowCheckbox = wrapper.find('[data-testid="toggle-arrows"]')

    expect(wrapper.findAll('.nav-bar')).toHaveLength(2)

    await arrowCheckbox.setValue(false)
    expect(wrapper.findAll('.nav-bar')).toHaveLength(0)
    expect(wrapper.find('.question-area').classes()).toContain('arrows-disabled')

    await arrowCheckbox.setValue(true)
    expect(wrapper.findAll('.nav-bar')).toHaveLength(2)
    expect(wrapper.find('.question-area').classes()).not.toContain('arrows-disabled')
  })

  it('moves forward with ArrowRight when navigation is enabled', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.counter').text()).toContain('第 2 题')
  })

  it('does not respond to keyboard navigation when navigation is disabled', async () => {
    const navigationCheckbox = wrapper.find('[data-testid="toggle-navigation"]')

    await navigationCheckbox.setValue(false)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.counter').text()).toContain('第 1 题')
  })

  it('moves forward on a left swipe when navigation is enabled', async () => {
    await swipeLeft()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.counter').text()).toContain('第 2 题')
  })

  it('ignores swipe navigation when navigation is disabled', async () => {
    const navigationCheckbox = wrapper.find('[data-testid="toggle-navigation"]')

    await navigationCheckbox.setValue(false)
    await swipeLeft()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.counter').text()).toContain('第 1 题')
  })

  it('keeps subtraction questions non-negative while generating new history', async () => {
    for (let i = 0; i < 30; i++) {
      await wrapper.find('.nav-bar.right').trigger('click')
    }

    const questions = wrapper.findAll('.question').map((node) => node.text())
    expect(questions.length).toBeGreaterThan(0)
    const latest = wrapper.find('.question').text().match(/^(\d+) ([+-]) (\d+)$/)
    expect(latest).not.toBeNull()
    const isNonNegativeSubtraction =
      latest?.[2] !== '-' || Number(latest[1]) >= Number(latest[3])
    expect(isNonNegativeSubtraction).toBe(true)
  })
})
