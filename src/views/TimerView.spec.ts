import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import TimerView from './TimerView.vue'
import { useTimerStore } from '../stores/timer'

vi.mock('../utils/audio', () => ({
  playTickSound: vi.fn(),
  playCompleteSound: vi.fn(),
}))

describe('TimerView', () => {
  function mountTimerView() {
    return mount(TimerView, {
      global: {
        stubs: {
          GameLayout: {
            template: '<div><slot name="settings" /><slot /></div>',
          },
          CircularProgress: {
            template: '<div><slot /></div>',
          },
        },
      },
    })
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('shows the configured countdown and a start control', () => {
    const wrapper = mountTimerView()

    expect(wrapper.find('.time-display').text()).toBe('05:00')
    expect(wrapper.get('[role="timer"]').attributes('aria-live')).toBe('off')
    expect(wrapper.get('button.control-btn.primary').attributes('aria-label')).toBe('开始')
    expect(wrapper.get('.timer-progress .controls')).toBeTruthy()
    expect(wrapper.get('button[aria-label="重置"]').text()).toBe('🔄')
  })

  it('supports start, pause, resume, and reset controls', async () => {
    const wrapper = mountTimerView()
    const store = useTimerStore()

    await wrapper.get('button[aria-label="开始"]').trigger('click')
    expect(store.isRunning).toBe(true)
    expect(wrapper.get('button[aria-label="暂停"]').text()).toBe('⏸️')

    await wrapper.get('button[aria-label="暂停"]').trigger('click')
    expect(store.isPaused).toBe(true)
    expect(wrapper.get('button[aria-label="继续"]').text()).toBe('▶️')

    await wrapper.get('button[aria-label="继续"]').trigger('click')
    expect(store.isRunning).toBe(true)

    await wrapper.get('button[aria-label="重置"]').trigger('click')
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(store.durationMs)
    expect(store.currentLap).toBe(0)
  })

  it('keeps alert and loop options in settings without a duration field', () => {
    const wrapper = mountTimerView()

    expect(wrapper.get('#timer-alert-seconds').element).toMatchObject({
      value: '5',
      max: '15',
    })
    expect(wrapper.find('#timer-duration').exists()).toBe(false)
  })

  it('edits duration from page keys without an input or confirmation step', async () => {
    const wrapper = mountTimerView()
    const store = useTimerStore()
    const press = (key: string) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    press('1')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:01')
    press('0')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:10')
    press('0')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('01:00')

    expect(store.durationMs).toBe(60_000)
    expect(store.remainingTime).toBe(60_000)
    expect(wrapper.find('input.time-entry-input').exists()).toBe(true)

    press('Escape')
    press('6')
    await nextTick()
    press('9')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:69')
    press('Enter')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:69')

    await wrapper.get('button.control-btn.primary').trigger('click')
    expect(wrapper.get('.time-display').text()).toBe('01:09')
    expect(store.timeDisplay).toBe('01:09')
  })

  it('allows zero to be entered and displayed by typing or deleting digits', async () => {
    const wrapper = mountTimerView()
    const store = useTimerStore()
    const press = (key: string) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    press('0')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:00')
    expect(store.durationMs).toBe(0)

    press('0')
    press('Backspace')
    press('Backspace')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('00:00')

    const startButton = wrapper.get('button[aria-label="开始"]')
    expect(startButton.attributes('disabled')).toBeDefined()
    await startButton.trigger('click')
    expect(store.isRunning).toBe(false)
    expect(wrapper.get('.time-display').text()).toBe('00:00')
  })

  it('rejects entered durations above 99 minutes', async () => {
    const wrapper = mountTimerView()
    const store = useTimerStore()
    const press = (key: string) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    for (const digit of '9900') {
      press(digit)
      await nextTick()
    }
    expect(wrapper.get('.time-display').text()).toBe('99:00')
    expect(store.durationMs).toBe(99 * 60_000)

    press('0')
    await nextTick()
    expect(wrapper.get('.time-display').text()).toBe('99:00')
    expect(store.durationMs).toBe(99 * 60_000)
  })

  it('allows leading zeroes before entering the maximum duration', async () => {
    const wrapper = mountTimerView()
    const store = useTimerStore()
    const press = (key: string) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    for (const digit of '00009900') {
      press(digit)
      await nextTick()
    }

    expect(wrapper.get('.time-display').text()).toBe('99:00')
    expect(store.durationMs).toBe(99 * 60_000)
  })

  it('shows the configured duration and alert threshold in the store', () => {
    mountTimerView()
    const store = useTimerStore()

    expect(store.durationMinutes).toBe(5)
    expect(store.alertSeconds).toBe(5)
  })
})
