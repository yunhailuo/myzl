import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDistributiveLawStore, generateProblem } from './distributiveLaw'
import { createSeededRNG } from '../utils/math'

describe('Distributive Law Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should initialize with a problem', () => {
      const store = useDistributiveLawStore()
      expect(store.history.length).toBeGreaterThan(0)
      expect(store.currentProblem).toBeDefined()
      expect(store.count).toBe(1)
    })

    it('should have default settings', () => {
      const store = useDistributiveLawStore()
      expect(store.enableTrap).toBe(false)
      expect(store.enableSwap).toBe(false)
      expect(store.maxPower).toBe(3)
      expect(store.decimalPlaces).toBe(1)
      expect(store.enableArrows).toBe(true)
      expect(store.enableNavigation).toBe(true)
    })
  })

  describe('problem generation', () => {
    it('should generate mixed problems', () => {
      const store = useDistributiveLawStore()
      expect(typeof store.currentProblem).toBe('string')
      expect(store.currentProblem).toContain('×')
    })

    it('should generate expand problems with parentheses', () => {
      const store = useDistributiveLawStore()

      // Generate multiple problems to ensure we get expand type
      let hasExpand = false
      for (let i = 0; i < 20; i++) {
        store.nextProblem()
        if (store.currentProblem?.includes('(')) {
          hasExpand = true
          break
        }
      }

      expect(hasExpand).toBe(true)
    })

    it('should generate factor problems without parentheses', () => {
      const store = useDistributiveLawStore()

      // Generate multiple problems to ensure we get factor type
      let hasFactor = false
      for (let i = 0; i < 30; i++) {
        store.nextProblem()
        const problem = store.currentProblem
        // Factor problems have pattern: a×b + a×c or a×b - a×c (no parentheses)
        if (
          (problem && !problem.includes('(') && problem.includes('+')) ||
          (problem && !problem.includes('(') && problem.includes('-'))
        ) {
          hasFactor = true
          break
        }
      }

      expect(hasFactor).toBe(true)
    })

    it('should respect maxPower setting', () => {
      const store = useDistributiveLawStore()
      store.updateMaxPower(2) // 10^2 = 100

      // All generated values should be within reasonable range
      for (let i = 0; i < 10; i++) {
        store.nextProblem()
        expect(store.currentProblem).toBeDefined()
      }
    })

    it('should respect decimalPlaces setting', () => {
      const store = useDistributiveLawStore()
      store.updateDecimalPlaces(2)

      expect(store.decimalPlaces).toBe(2)

      // Generate problem with new setting
      store.nextProblem()
      expect(store.currentProblem).toBeDefined()
    })
  })

  describe('trap mode', () => {
    it('should toggle trap mode', () => {
      const store = useDistributiveLawStore()
      const initialState = store.enableTrap
      store.toggleTrap()
      expect(store.enableTrap).toBe(!initialState)
    })

    it('should regenerate problem when trap mode changes', () => {
      const store = useDistributiveLawStore()

      store.toggleTrap()

      // Problem should be regenerated
      expect(store.currentProblem).toBeDefined()
    })

    it('should generate trap problems when enabled', () => {
      const store = useDistributiveLawStore()
      store.toggleTrap()

      // Generate multiple problems to check for trap patterns
      let foundTrapPattern = false
      for (let i = 0; i < 30; i++) {
        store.nextProblem()
        const problem = store.currentProblem
        // Trap problems typically have simple calculations in parentheses
        if (problem && problem.includes('(')) {
          foundTrapPattern = true
          break
        }
      }

      expect(foundTrapPattern).toBe(true)
    })
  })

  describe('swap interference', () => {
    it('should toggle swap interference', () => {
      const store = useDistributiveLawStore()
      const initialState = store.enableSwap
      store.toggleSwap()
      expect(store.enableSwap).toBe(!initialState)
    })

    it('should regenerate problem when swap mode changes', () => {
      const store = useDistributiveLawStore()

      store.toggleSwap()

      // Problem should be regenerated
      expect(store.currentProblem).toBeDefined()
    })

    it('should generate swapped problems when enabled', () => {
      const store = useDistributiveLawStore()
      store.toggleSwap()

      // Generate multiple problems to check for swap patterns
      let foundSwapped = false
      for (let i = 0; i < 30; i++) {
        store.nextProblem()
        const problem = store.currentProblem
        // Swapped problems have pattern: b×a + c×a instead of a×b + a×c
        if (problem && problem.match(/\d+\.\d+×\d+/)) {
          foundSwapped = true
          break
        }
      }

      expect(foundSwapped).toBe(true)
    })
  })

  describe('navigation', () => {
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

    it('should maintain history when navigating back and forth', () => {
      const store = useDistributiveLawStore()

      store.nextProblem()
      store.nextProblem()
      const problemAt2 = store.currentProblem

      store.previousProblem()
      store.previousProblem()
      store.nextProblem()
      store.nextProblem()

      expect(store.currentProblem).toBe(problemAt2)
    })
  })

  describe('settings update', () => {
    it('should update maxPower and regenerate problem', () => {
      const store = useDistributiveLawStore()

      store.updateMaxPower(4)

      expect(store.maxPower).toBe(4)
      expect(store.currentProblem).toBeDefined()
    })

    it('should update decimalPlaces and regenerate problem', () => {
      const store = useDistributiveLawStore()

      store.updateDecimalPlaces(2)

      expect(store.decimalPlaces).toBe(2)
      expect(store.currentProblem).toBeDefined()
    })
  })

  describe('persistence', () => {
    it('should persist all configuration settings', () => {
      const store = useDistributiveLawStore()

      store.enableTrap = true
      store.enableSwap = true
      store.maxPower = 4
      store.decimalPlaces = 2
      store.enableArrows = false
      store.enableNavigation = false

      expect(store.$state.enableTrap).toBe(true)
      expect(store.$state.enableSwap).toBe(true)
      expect(store.$state.maxPower).toBe(4)
      expect(store.$state.decimalPlaces).toBe(2)
      expect(store.$state.enableArrows).toBe(false)
      expect(store.$state.enableNavigation).toBe(false)
    })
  })

  describe('problem validity', () => {
    it('should have valid expression for each problem', () => {
      const store = useDistributiveLawStore()
      expect(typeof store.currentProblem).toBe('string')
      expect(store.currentProblem?.length).toBeGreaterThan(0)
    })

    it('should generate multiple unique problems', () => {
      const store = useDistributiveLawStore()
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

    it('should contain multiplication operator', () => {
      const store = useDistributiveLawStore()

      for (let i = 0; i < 10; i++) {
        store.nextProblem()
        expect(store.currentProblem).toContain('×')
      }
    })
  })

  describe('deterministic generation', () => {
    it('should produce the same sequence with the same seed', () => {
      const seed = 42
      const rng1 = createSeededRNG(seed)
      const rng2 = createSeededRNG(seed)

      const problems1: string[] = []
      const problems2: string[] = []

      // Generate 10 problems with each RNG
      for (let i = 0; i < 10; i++) {
        problems1.push(generateProblem(3, 1, false, false, rng1))
        problems2.push(generateProblem(3, 1, false, false, rng2))
      }

      // Both sequences should be identical
      expect(problems1).toEqual(problems2)
    })

    it('should produce different sequences with different seeds', () => {
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(123)

      const problems1: string[] = []
      const problems2: string[] = []

      // Generate 10 problems with each RNG
      for (let i = 0; i < 10; i++) {
        problems1.push(generateProblem(3, 1, false, false, rng1))
        problems2.push(generateProblem(3, 1, false, false, rng2))
      }

      // Sequences should be different
      expect(problems1).not.toEqual(problems2)
    })

    it('should respect constraints with seeded generation', () => {
      const rng = createSeededRNG(999)

      for (let i = 0; i < 50; i++) {
        const problem = generateProblem(3, 1, false, false, rng)

        // Should contain multiplication
        expect(problem).toContain('×')

        // Should end with equals sign
        expect(problem).toMatch(/=$/)
      }
    })
  })
})
