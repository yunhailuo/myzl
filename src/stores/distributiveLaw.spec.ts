import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDistributiveLawStore } from './distributiveLaw'

describe('Distributive Law Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with a problem', () => {
    const store = useDistributiveLawStore()
    expect(store.history.length).toBeGreaterThan(0)
    expect(store.currentProblem).toBeDefined()
    expect(store.count).toBe(1)
  })

  it('should generate mixed problems', () => {
    const store = useDistributiveLawStore()
    expect(typeof store.currentProblem).toBe('string')
    expect(store.currentProblem).toContain('×')
  })

  it('should navigate to next problem', () => {
    const store = useDistributiveLawStore()
    const initialCount = store.count
    store.nextProblem()
    expect(store.count).toBe(initialCount + 1)
  })

  it('should navigate to previous problem', () => {
    const store = useDistributiveLawStore()
    store.nextProblem()
    const currentCount = store.count
    store.previousProblem()
    expect(store.count).toBe(currentCount - 1)
  })

  it('should not go below index 0', () => {
    const store = useDistributiveLawStore()
    store.previousProblem()
    expect(store.currentIndex).toBe(0)
  })

  it('should toggle trap mode', () => {
    const store = useDistributiveLawStore()
    const initialState = store.enableTrap
    store.toggleTrap()
    expect(store.enableTrap).toBe(!initialState)
  })

  it('should toggle swap interference', () => {
    const store = useDistributiveLawStore()
    const initialState = store.enableSwap
    store.toggleSwap()
    expect(store.enableSwap).toBe(!initialState)
  })

  it('should have valid expression for each problem', () => {
    const store = useDistributiveLawStore()
    expect(typeof store.currentProblem).toBe('string')
    expect(store.currentProblem?.length).toBeGreaterThan(0)
  })
})
