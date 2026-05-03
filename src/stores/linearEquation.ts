import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeStorage } from '../utils/storage'
import { pickRandom, shuffleArray } from '../utils/math'
import { useQuestionHistory } from '../composables/useQuestionHistory'

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
  return terms
    .map(([val, isVar], i) => {
      const sign = i === 0 ? (val > 0 ? '' : '-') : val > 0 ? ' + ' : ' - '
      const absVal = Math.abs(val)
      const item = isVar ? (absVal === 1 ? variable : `${absVal}${variable}`) : String(absVal)
      return `${sign}${item}`
    })
    .join('')
}

/** Generate random linear equation problem */
export function generateProblem(maxTerms = 8): LinearEquationProblem {
  const target = Math.max(
    4,
    Math.min(12, Math.floor(Math.random() * (maxTerms - 4 + 1)) + 4),
  )

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
  const leftTerms: Term[] = [
    [A, true],
    [B, false],
  ]
  const rightTerms: Term[] = [
    [C, true],
    [D, false],
  ]

  // Expand terms until reaching target
  let expandAttempts = 0
  while (
    leftTerms.length + rightTerms.length < target &&
    expandAttempts < MAX_EXPAND_ATTEMPTS
  ) {
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

/**
 * Create a problem generator bound to current store settings.
 * This is used for batch generation to respect user's persisted configuration.
 */
export function createBatchGenerator() {
  const store = useLinearEquationStore()
  return () => generateProblem(store.maxTerms)
}

export const useLinearEquationStore = defineStore(
  'linearEquation',
  () => {
    // State
    const maxTerms = ref(8)
    const enableArrows = ref(true)
    const enableNavigation = ref(true)

    const { history, currentIndex, currentItem, count, next, previous, resetToFirst } =
      useQuestionHistory(() => generateProblem(maxTerms.value))

    // Actions
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
      currentProblem: currentItem,
      count,
      nextProblem: next,
      previousProblem: previous,
      resetToFirst,
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
