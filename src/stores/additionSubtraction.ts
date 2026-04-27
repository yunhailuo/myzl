import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeStorage } from '../utils/storage'
import { useQuestionHistory } from '../composables/useQuestionHistory'

interface Question {
  num1: number
  num2: number
  op: '+' | '-'
}

/** Generate a random addition/subtraction question */
function generateQuestion(): Question {
  const op = Math.random() < 0.5 ? '+' : '-'
  let num1 = Math.floor(Math.random() * 19) + 1
  let num2 = Math.floor(Math.random() * 19) + 1
  if (op === '-') {
    if (num1 < num2) {
      ;[num1, num2] = [num2, num1]
    }
  }
  return { num1, num2, op }
}

export const useAdditionSubtractionStore = defineStore(
  'additionSubtraction',
  () => {
    // ========== State ==========

    const { history, currentIndex, currentItem, count, next, previous, resetToFirst } =
      useQuestionHistory(generateQuestion)

    /** Show navigation arrows */
    const enableArrows = ref(true)
    /** Enable keyboard and swipe navigation */
    const enableNavigation = ref(true)

    return {
      // State
      history,
      currentIndex,
      enableArrows,
      enableNavigation,

      // Getters
      currentQuestion: currentItem,
      count,

      // Actions
      nextQuestion: next,
      previousQuestion: previous,
      resetToFirst,
    }
  },
  {
    persist: {
      pick: ['enableArrows', 'enableNavigation'],
      storage: safeStorage,
    },
  },
)
