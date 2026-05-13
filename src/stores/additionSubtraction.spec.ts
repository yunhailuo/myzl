import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAdditionSubtractionStore, generateProblem } from './additionSubtraction'
import { createSeededRNG } from '../utils/math'

describe('additionSubtraction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should initialize with one problem in history', () => {
      const store = useAdditionSubtractionStore()
      expect(store.history.length).toBe(1)
    })

    it('should start at index 0', () => {
      const store = useAdditionSubtractionStore()
      expect(store.currentIndex).toBe(0)
    })

    it('should have arrows enabled by default', () => {
      const store = useAdditionSubtractionStore()
      expect(store.enableArrows).toBe(true)
    })

    it('should have navigation enabled by default', () => {
      const store = useAdditionSubtractionStore()
      expect(store.enableNavigation).toBe(true)
    })

    it('should have currentProblem matching first history item', () => {
      const store = useAdditionSubtractionStore()
      expect(store.currentProblem).toBe(store.history[0])
    })

    it('should have count equal to 1 initially', () => {
      const store = useAdditionSubtractionStore()
      expect(store.count).toBe(1)
    })
  })

  describe('problem generation', () => {
    it('should generate addition problems', () => {
      const store = useAdditionSubtractionStore()
      let hasAddition = false

      // Generate multiple problems to ensure we get an addition
      for (let i = 0; i < 20; i++) {
        store.nextProblem()
        if (store.currentProblem?.includes('+')) {
          hasAddition = true
          break
        }
      }

      expect(hasAddition).toBe(true)
    })

    it('should generate subtraction problems', () => {
      const store = useAdditionSubtractionStore()
      let hasSubtraction = false

      // Generate multiple problems to ensure we get a subtraction
      for (let i = 0; i < 20; i++) {
        store.nextProblem()
        if (store.currentProblem?.includes('-')) {
          hasSubtraction = true
          break
        }
      }

      expect(hasSubtraction).toBe(true)
    })

    it('should generate valid problem format', () => {
      const store = useAdditionSubtractionStore()

      for (let i = 0; i < 30; i++) {
        store.nextProblem()
        expect(store.currentProblem).toMatch(/^\d+ [+-] \d+ = $/)
      }
    })
  })

  describe('navigation', () => {
    it('should move to next problem and create new one if at end', () => {
      const store = useAdditionSubtractionStore()
      const initialLength = store.history.length

      store.nextProblem()

      expect(store.currentIndex).toBe(1)
      expect(store.history.length).toBe(initialLength + 1)
      expect(store.count).toBe(2)
    })

    it('should move to existing next problem without creating new one', () => {
      const store = useAdditionSubtractionStore()

      // Create a few problems
      store.nextProblem()
      store.nextProblem()
      const historyLength = store.history.length

      // Go back and then forward
      store.previousProblem()
      store.nextProblem()

      expect(store.history.length).toBe(historyLength) // No new problem created
    })

    it('should move to previous problem', () => {
      const store = useAdditionSubtractionStore()

      store.nextProblem()
      store.nextProblem()
      expect(store.currentIndex).toBe(2)

      store.previousProblem()
      expect(store.currentIndex).toBe(1)
      expect(store.count).toBe(2)
    })

    it('should not go below index 0', () => {
      const store = useAdditionSubtractionStore()

      store.previousProblem()
      expect(store.currentIndex).toBe(0)
    })

    it('should reset to first problem', () => {
      const store = useAdditionSubtractionStore()

      store.nextProblem()
      store.nextProblem()
      store.nextProblem()
      expect(store.currentIndex).toBe(3)

      store.resetToFirst()
      expect(store.currentIndex).toBe(0)
      expect(store.count).toBe(1)
    })
  })

  describe('persistence configuration', () => {
    it('should persist enableArrows and enableNavigation settings', () => {
      const store = useAdditionSubtractionStore()

      store.enableArrows = false
      store.enableNavigation = false

      expect(store.$state.enableArrows).toBe(false)
      expect(store.$state.enableNavigation).toBe(false)
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
        problems1.push(generateProblem(10, 50, 1, 20, true, true, 0, rng1))
        problems2.push(generateProblem(10, 50, 1, 20, true, true, 0, rng2))
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
        problems1.push(generateProblem(10, 50, 1, 20, true, true, 0, rng1))
        problems2.push(generateProblem(10, 50, 1, 20, true, true, 0, rng2))
      }

      // Sequences should be different
      expect(problems1).not.toEqual(problems2)
    })

    it('should respect range constraints with seeded generation', () => {
      // Test addition problems separately
      const addRng = createSeededRNG(100)
      for (let i = 0; i < 20; i++) {
        const problem = generateProblem(10, 50, 1, 20, true, false, 0, addRng)
        const match = problem.match(/^(\d+) \+ (\d+) = $/)
        expect(match).not.toBeNull()

        const sum = parseInt(match![1]!) + parseInt(match![2]!)
        expect(sum).toBeGreaterThanOrEqual(10)
        expect(sum).toBeLessThanOrEqual(50)
      }

      // Test subtraction problems separately
      const subRng = createSeededRNG(200)
      for (let i = 0; i < 20; i++) {
        const problem = generateProblem(10, 50, 1, 20, false, true, 0, subRng)
        const match = problem.match(/^(\d+) - (\d+) = $/)
        expect(match).not.toBeNull()

        const minuend = parseInt(match![1]!)
        const subtrahend = parseInt(match![2]!)
        expect(minuend).toBeGreaterThanOrEqual(subtrahend)
      }
    })

    it('should work with decimal places in seeded generation', () => {
      const rng = createSeededRNG(777)

      for (let i = 0; i < 20; i++) {
        const problem = generateProblem(10, 50, 1, 20, true, true, 2, rng)

        // Should contain decimal points or be integers
        expect(problem).toMatch(/^[\d.]+ [+-] [\d.]+ = $/)
      }
    })
  })
})
