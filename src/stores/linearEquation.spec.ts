import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLinearEquationStore } from './linearEquation'

describe('Linear Equation Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with a problem', () => {
    const store = useLinearEquationStore()
    expect(store.history.length).toBeGreaterThan(0)
    expect(store.currentProblem).toBeDefined()
    expect(store.count).toBe(1)
  })

  it('should generate valid equation format', () => {
    const store = useLinearEquationStore()
    const problem = store.currentProblem
    expect(typeof problem).toBe('string')
    expect(problem).toContain('=')
  })

  it('should use valid letters (not x)', () => {
    const store = useLinearEquationStore()
    const problem = store.currentProblem
    if (!problem) return
    
    const letters = problem.match(/[a-z]/g) || []
    letters.forEach((letter) => {
      expect(letter).not.toBe('x')
    })
  })

  it('should navigate to next problem', () => {
    const store = useLinearEquationStore()
    const initialCount = store.count
    store.nextProblem()
    expect(store.count).toBe(initialCount + 1)
  })

  it('should navigate to previous problem', () => {
    const store = useLinearEquationStore()
    store.nextProblem()
    const currentCount = store.count
    store.previousProblem()
    expect(store.count).toBe(currentCount - 1)
  })

  it('should not go below index 0', () => {
    const store = useLinearEquationStore()
    store.previousProblem()
    expect(store.currentIndex).toBe(0)
  })

  it('should respect max terms setting', () => {
    const store = useLinearEquationStore()
    store.updateMaxTerms(6)
    expect(store.maxTerms).toBe(6)
  })

  it('should enforce minimum max terms of 4', () => {
    const store = useLinearEquationStore()
    store.updateMaxTerms(2)
    expect(store.maxTerms).toBe(4)
  })

  it('should enforce maximum max terms of 12', () => {
    const store = useLinearEquationStore()
    store.updateMaxTerms(15)
    expect(store.maxTerms).toBe(12)
  })

  it('should regenerate problem when max terms changes', () => {
    const store = useLinearEquationStore()
    store.updateMaxTerms(8)
    expect(store.currentProblem).toBeDefined()
  })

  it('should have valid expression for each problem', () => {
    const store = useLinearEquationStore()
    expect(typeof store.currentProblem).toBe('string')
    expect(store.currentProblem?.length).toBeGreaterThan(0)
  })

  it('should generate multiple unique problems', () => {
    const store = useLinearEquationStore()
    const problems = new Set<string>()
    
    for (let i = 0; i < 10; i++) {
      store.nextProblem()
      if (store.currentProblem) {
        problems.add(store.currentProblem)
      }
    }
    
    // Should have generated different problems
    expect(problems.size).toBeGreaterThan(1)
  })
})
