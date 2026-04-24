import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Question {
  num1: number
  num2: number
  op: '+' | '-'
}

/**
 * 生成一道加减法题目
 */
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

export const useAdditionSubtractionStore = defineStore('additionSubtraction', () => {
  // ========== State ==========
  
  /** 题目历史记录 */
  const history = ref<Question[]>([generateQuestion()])
  /** 当前题目索引 */
  const currentIndex = ref(0)
  
  /** 是否显示左右箭头按钮 */
  const enableArrows = ref(true)
  /** 是否启用键盘和滑动手势导航 */
  const enableNavigation = ref(true)

  // ========== Getters ==========
  
  /** 当前题目 */
  const currentQuestion = computed(() => history.value[currentIndex.value])
  
  /** 当前题号 */
  const count = computed(() => currentIndex.value + 1)

  // ========== Actions ==========
  
  /** 跳转到下一题（如果已到最后一题则生成新题） */
  function nextQuestion() {
    if (currentIndex.value < history.value.length - 1) {
      currentIndex.value++
    } else {
      history.value.push(generateQuestion())
      currentIndex.value = history.value.length - 1
    }
  }

  /** 跳转到上一题 */
  function previousQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /** 重置到第一题 */
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
}, {
  persist: {
    pick: ['enableArrows', 'enableNavigation'],
  },
})
