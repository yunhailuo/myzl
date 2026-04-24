import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

// Custom storage with error handling
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Failed to get item from localStorage:', error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Failed to set item in localStorage:', error)
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error)
    }
  },
}

export const useAdditionSubtractionStore = defineStore(
  'additionSubtraction',
  () => {
    // ========== State ==========

    /** Question history */
    const history = ref<Question[]>([generateQuestion()])
    /** Current question index */
    const currentIndex = ref(0)

    /** Show navigation arrows */
    const enableArrows = ref(true)
    /** Enable keyboard and swipe navigation */
    const enableNavigation = ref(true)

    // ========== Getters ==========

    /** Current question */
    const currentQuestion = computed(() => history.value[currentIndex.value])

    /** Current question number */
    const count = computed(() => currentIndex.value + 1)

    // ========== Actions ==========

    /** Go to next question (generates new one if at the end) */
    function nextQuestion() {
      if (currentIndex.value < history.value.length - 1) {
        currentIndex.value++
      } else {
        history.value.push(generateQuestion())
        currentIndex.value = history.value.length - 1
      }
    }

    /** Go to previous question */
    function previousQuestion() {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
    }

    /** Reset to first question */
    function resetToFirst() {
      currentIndex.value = 0
    }

    return {
      // State
      history,
      currentIndex,
      enableArrows,
      enableNavigation,

      // Getters
      currentQuestion,
      count,

      // Actions
      nextQuestion,
      previousQuestion,
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
