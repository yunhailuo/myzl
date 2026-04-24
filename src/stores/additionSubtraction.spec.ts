import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAdditionSubtractionStore } from './additionSubtraction'

describe('additionSubtraction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should initialize with one question in history', () => {
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

    it('should have currentQuestion matching first history item', () => {
      const store = useAdditionSubtractionStore()
      expect(store.currentQuestion).toEqual(store.history[0])
    })

    it('should have count equal to 1 initially', () => {
      const store = useAdditionSubtractionStore()
      expect(store.count).toBe(1)
    })
  })

  describe('generateQuestion', () => {
    it('should generate addition questions', () => {
      const store = useAdditionSubtractionStore()
      let hasAddition = false
      
      // Generate multiple questions to ensure we get an addition
      for (let i = 0; i < 20; i++) {
        store.nextQuestion()
        const question = store.currentQuestion
        if (question && question.op === '+') {
          hasAddition = true
          break
        }
      }
      
      expect(hasAddition).toBe(true)
    })

    it('should generate subtraction questions', () => {
      const store = useAdditionSubtractionStore()
      let hasSubtraction = false
      
      // Generate multiple questions to ensure we get a subtraction
      for (let i = 0; i < 20; i++) {
        store.nextQuestion()
        const question = store.currentQuestion
        if (question && question.op === '-') {
          hasSubtraction = true
          break
        }
      }
      
      expect(hasSubtraction).toBe(true)
    })

    it('should ensure subtraction results are non-negative', () => {
      const store = useAdditionSubtractionStore()
      
      // Generate many questions and check all subtractions
      for (let i = 0; i < 50; i++) {
        store.nextQuestion()
        const question = store.currentQuestion
        if (question && question.op === '-') {
          expect(question.num1).toBeGreaterThanOrEqual(question.num2)
        }
      }
    })

    it('should generate numbers between 1 and 19', () => {
      const store = useAdditionSubtractionStore()
      
      for (let i = 0; i < 30; i++) {
        store.nextQuestion()
        const question = store.currentQuestion
        if (question) {
          expect(question.num1).toBeGreaterThanOrEqual(1)
          expect(question.num1).toBeLessThanOrEqual(19)
          expect(question.num2).toBeGreaterThanOrEqual(1)
          expect(question.num2).toBeLessThanOrEqual(19)
        }
      }
    })
  })

  describe('navigation', () => {
    it('should move to next question and create new one if at end', () => {
      const store = useAdditionSubtractionStore()
      const initialLength = store.history.length
      
      store.nextQuestion()
      
      expect(store.currentIndex).toBe(1)
      expect(store.history.length).toBe(initialLength + 1)
      expect(store.count).toBe(2)
    })

    it('should move to existing next question without creating new one', () => {
      const store = useAdditionSubtractionStore()
      
      // Create a few questions
      store.nextQuestion()
      store.nextQuestion()
      const historyLength = store.history.length
      
      // Go back and then forward
      store.previousQuestion()
      store.nextQuestion()
      
      expect(store.history.length).toBe(historyLength) // No new question created
    })

    it('should move to previous question', () => {
      const store = useAdditionSubtractionStore()
      
      store.nextQuestion()
      store.nextQuestion()
      expect(store.currentIndex).toBe(2)
      
      store.previousQuestion()
      expect(store.currentIndex).toBe(1)
      expect(store.count).toBe(2)
    })

    it('should not go below index 0', () => {
      const store = useAdditionSubtractionStore()
      
      store.previousQuestion()
      expect(store.currentIndex).toBe(0)
    })

    it('should reset to first question', () => {
      const store = useAdditionSubtractionStore()
      
      store.nextQuestion()
      store.nextQuestion()
      store.nextQuestion()
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
