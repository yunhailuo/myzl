import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeStorage } from '../utils/storage'
import { useQuestionHistory } from '../composables/useQuestionHistory'

/** Problem expression string */
type AdditionSubtractionProblem = string

/** Generate a random addition/subtraction problem */
function generateProblem(): AdditionSubtractionProblem {
  const op = Math.random() < 0.5 ? '+' : '-'
  let num1 = Math.floor(Math.random() * 19) + 1
  let num2 = Math.floor(Math.random() * 19) + 1
  if (op === '-') {
    if (num1 < num2) {
      ;[num1, num2] = [num2, num1]
    }
  }
  return `${num1} ${op} ${num2}`
}

export const useAdditionSubtractionStore = defineStore(
  'additionSubtraction',
  () => {
    // ========== State ==========

    const { history, currentIndex, currentItem, count, next, previous, resetToFirst } =
      useQuestionHistory(generateProblem)

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
      currentProblem: currentItem,
      count,

      // Actions
      nextProblem: next,
      previousProblem: previous,
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
