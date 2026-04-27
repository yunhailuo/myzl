import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** Problem expression string */
type LinearEquationProblem = string

/** Letter options (excluding x) */
const LETTERS = ['a', 'b', 'c', 'm', 'n', 't', 'y', 'z']

/** Solution set: non-zero integers with absolute value ≤ 4 */
const SOL_SET = [2, 3, 4, -2, -3, -4]

/** Coefficient range: [-5, -1] ∪ [1, 5] */
const COEFF_RANGE = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]

/** Constant range: [-10, -1] ∪ [1, 10] */
const CONST_RANGE = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/** Maximum retry attempts for finding valid constant D */
const MAX_RETRY_ATTEMPTS = 50

/** Maximum expansion attempts when adding terms */
const MAX_EXPAND_ATTEMPTS = 100

/** Term representation: [value, isVariable] */
type Term = [number, boolean]

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/** Shuffle an array using Fisher-Yates algorithm */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

/** Split integer val into two non-zero integers that sum to val */
function validSplit(val: number): Array<[number, number]> {
  const splits: Array<[number, number]> = []
  const limit = Math.min(Math.abs(val) + 1, 10)
  
  for (let a = -limit; a <= limit; a++) {
    if (a === 0) continue
    const b = val - a
    if (b !== 0 && Math.abs(b) <= 10) {
      splits.push([a, b])
    }
  }
  
  return splits
}

/** Format a side of the equation into a string */
function formatSide(terms: Term[], variable: string): string {
  return terms.map(([val, isVar], i) => {
    const sign = i === 0 ? (val > 0 ? '' : '-') : (val > 0 ? ' + ' : ' - ')
    const absVal = Math.abs(val)
    const item = isVar ? (absVal === 1 ? variable : `${absVal}${variable}`) : String(absVal)
    return `${sign}${item}`
  }).join('')
}

/** Generate a linear equation problem */
function generateProblem(maxTerms: number): LinearEquationProblem {
  const target = Math.max(4, Math.min(12, Math.floor(Math.random() * (maxTerms - 4 + 1)) + 4))
  
  // Select variable and solution
  const variable = pickRandom(LETTERS)
  const sol = pickRandom(SOL_SET)
  
  // Select coefficients A (left) and C (right), ensure A ≠ C
  let A: number, C: number
  do {
    A = pickRandom(COEFF_RANGE)
    C = pickRandom(COEFF_RANGE)
  } while (A === C)
  
  // Select left constant B, calculate right constant D
  let B = pickRandom(CONST_RANGE)
  let D = B + (A - C) * sol
  
  // Retry with different values if D is invalid
  let attempts = 0
  while ((D < -10 || D > 10 || D === 0) && attempts < MAX_RETRY_ATTEMPTS) {
    B = pickRandom(CONST_RANGE)
    D = B + (A - C) * sol
    attempts++
  }
  
  // Fallback: adjust coefficients if still invalid
  if (D < -10 || D > 10 || D === 0) {
    A = 2
    C = 1
    B = 1
    D = B + (A - C) * sol
  }
  
  // Build base terms (4 terms)
  const leftTerms: Term[] = [[A, true], [B, false]]
  const rightTerms: Term[] = [[C, true], [D, false]]
  
  // Expand terms until reaching target
  let expandAttempts = 0
  while (leftTerms.length + rightTerms.length < target && expandAttempts < MAX_EXPAND_ATTEMPTS) {
    expandAttempts++
    const side = Math.random() < 0.5 ? 'L' : 'R'
    const terms = side === 'L' ? leftTerms : rightTerms
    
    if (terms.length === 0) continue
    
    const idx = Math.floor(Math.random() * terms.length)
    const [val, isVar] = terms[idx]!
    const splits = validSplit(val)
    
    if (splits.length > 0) {
      const [a1, a2] = pickRandom(splits)
      terms.splice(idx, 1)
      terms.splice(idx, 0, [a1, isVar], [a2, isVar])
    }
  }
  
  // Shuffle and format
  shuffleArray(leftTerms)
  shuffleArray(rightTerms)
  
  return `${formatSide(leftTerms, variable)} = ${formatSide(rightTerms, variable)}`
}

/** Custom storage with error handling */
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}

export const useLinearEquationStore = defineStore(
  'linearEquation',
  () => {
    // State
    const history = ref<LinearEquationProblem[]>([])
    const currentIndex = ref(0)
    const maxTerms = ref(8)
    const enableArrows = ref(true)
    const enableNavigation = ref(true)

    // Initialize with first problem
    if (history.value.length === 0) {
      history.value.push(generateProblem(maxTerms.value))
    }

    // Getters
    const currentProblem = computed(() => history.value[currentIndex.value])
    const count = computed(() => currentIndex.value + 1)

    // Actions
    function nextProblem() {
      if (currentIndex.value < history.value.length - 1) {
        currentIndex.value++
      } else {
        history.value.push(generateProblem(maxTerms.value))
        currentIndex.value = history.value.length - 1
      }
    }

    function previousProblem() {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
    }

    function updateMaxTerms(value: number) {
      maxTerms.value = Math.max(4, Math.min(12, value))
      history.value[currentIndex.value] = generateProblem(maxTerms.value)
    }

    return {
      history,
      currentIndex,
      maxTerms,
      enableArrows,
      enableNavigation,
      currentProblem,
      count,
      nextProblem,
      previousProblem,
      updateMaxTerms,
    }
  },
  {
    persist: {
      pick: ['maxTerms', 'enableArrows', 'enableNavigation'],
      storage: safeStorage,
    },
  },
)
