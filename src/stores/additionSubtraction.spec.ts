import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAdditionSubtractionStore } from './additionSubtraction'

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
})
