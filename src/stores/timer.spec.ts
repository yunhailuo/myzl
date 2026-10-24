import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTimerStore } from './timer'

const { playCompleteSound, playTickSound } = vi.hoisted(() => ({
  playCompleteSound: vi.fn(),
  playTickSound: vi.fn(),
}))

vi.mock('../utils/audio', () => ({ playCompleteSound, playTickSound }))

describe('Timer store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('starts with a five-minute countdown', () => {
    const store = useTimerStore()

    expect(store.durationMinutes).toBe(5)
    expect(store.durationMs).toBe(300_000)
    expect(store.remainingTime).toBe(300_000)
    expect(store.timeDisplay).toBe('05:00')
    expect(store.progress).toBe(0)
  })

  it('formats the remaining time and clamps progress', () => {
    const store = useTimerStore()

    store.remainingTime = 269_500
    expect(store.timeDisplay).toBe('04:30')
    expect(store.progress).toBeCloseTo(10.17)

    store.remainingTime = -1
    expect(store.timeDisplay).toBe('00:00')
    expect(store.progress).toBe(100)
  })

  it('sets a duration in seconds with second precision', () => {
    const store = useTimerStore()

    store.setDurationSeconds(150)

    expect(store.durationMinutes).toBe(2.5)
    expect(store.durationMs).toBe(150_000)
    expect(store.remainingTime).toBe(150_000)
    expect(store.timeDisplay).toBe('02:30')
  })

  it('allows a zero duration and does not start an empty countdown', () => {
    const store = useTimerStore()
    store.setDurationSeconds(0)

    expect(store.durationMs).toBe(0)
    expect(store.remainingTime).toBe(0)
    expect(store.timeDisplay).toBe('00:00')

    store.start()
    expect(store.isRunning).toBe(false)
  })

  it('stops an active countdown when its duration is set to zero', () => {
    const store = useTimerStore()
    store.start()

    store.setDurationSeconds(0)

    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(0)
    vi.advanceTimersByTime(1_000)
    expect(store.remainingTime).toBe(0)
  })

  it('clears the lap count when resetting', () => {
    const store = useTimerStore()
    store.currentLap = 3

    store.reset()

    expect(store.currentLap).toBe(0)
  })

  it('clamps duration to 99 minutes and alerts to 15 seconds', () => {
    const store = useTimerStore()

    store.setDurationSeconds(-1)
    expect(store.durationMinutes).toBe(0)
    store.setDurationSeconds(99 * 60 + 1)
    expect(store.durationMinutes).toBe(99)

    store.setAlertSeconds(0)
    expect(store.alertSeconds).toBe(1)
    store.setAlertSeconds(16)
    expect(store.alertSeconds).toBe(15)

    expect(() => store.setDurationSeconds(Number.NaN)).toThrow(RangeError)
    expect(() => store.setAlertSeconds(Number.NaN)).toThrow(RangeError)
  })

  it('clamps persisted duration and alert settings to the current limits', () => {
    const store = useTimerStore()

    store.durationMinutes = 999
    store.alertSeconds = 60

    expect(store.durationMinutes).toBe(99)
    expect(store.remainingTime).toBe(99 * 60_000)
    expect(store.alertSeconds).toBe(15)
  })

  it('updates the active countdown when the duration changes while running', () => {
    const store = useTimerStore()
    store.start()
    store.remainingTime = 240_000

    store.setDurationSeconds(10 * 60)

    expect(store.durationMs).toBe(600_000)
    expect(store.remainingTime).toBe(600_000)
    expect(store.isRunning).toBe(true)

    vi.advanceTimersByTime(1_000)
    expect(store.remainingTime).toBeCloseTo(599_000)
  })

  it('pauses and resumes based on elapsed time', () => {
    const store = useTimerStore()
    store.start()

    vi.advanceTimersByTime(1_500)
    store.pause()

    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(true)
    expect(store.remainingTime).toBeCloseTo(298_500)

    vi.advanceTimersByTime(5_000)
    expect(store.remainingTime).toBeCloseTo(298_500)

    store.start()
    vi.advanceTimersByTime(1_000)
    store.pause()
    expect(store.remainingTime).toBeCloseTo(297_500)
  })

  it('restarts completed cycles and counts laps when looping', () => {
    const store = useTimerStore()
    store.setDurationSeconds(60)
    store.remainingTime = 50
    store.start()

    vi.advanceTimersByTime(100)

    expect(store.isRunning).toBe(true)
    expect(store.currentLap).toBe(1)
    expect(store.remainingTime).toBe(60_000)
  })

  it('stops at zero after a completed cycle when looping is disabled', () => {
    const store = useTimerStore()
    store.isLooping = false
    store.remainingTime = 50
    store.start()

    vi.advanceTimersByTime(100)

    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.currentLap).toBe(0)
    expect(store.remainingTime).toBe(0)
  })

  it('does not reset a completed countdown when changing alert settings', () => {
    const store = useTimerStore()
    store.isLooping = false
    store.remainingTime = 50
    store.start()
    vi.advanceTimersByTime(100)

    store.setAlertSeconds(5)

    expect(store.remainingTime).toBe(0)
  })

  it('plays one alert per remaining second and a completion sound', () => {
    const store = useTimerStore()
    store.isLooping = false
    store.alertSeconds = 2
    store.remainingTime = 1_100
    store.start()
    expect(playTickSound).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(playTickSound).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1_000)
    expect(playCompleteSound).toHaveBeenCalledTimes(1)
  })

  it('resets the countdown', () => {
    const store = useTimerStore()
    store.setDurationSeconds(10 * 60)
    store.start()
    store.pause()
    store.reset()

    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(600_000)
    expect(store.timeDisplay).toBe('10:00')
  })
})
