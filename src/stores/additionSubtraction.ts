import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeStorage } from '../utils/storage'
import { roundTo } from '../utils/math'
import { useQuestionHistory } from '../composables/useQuestionHistory'

/** Problem expression string */
type AdditionSubtractionProblem = string

/** Format a number for display: add parentheses for negative numbers */
function formatNumber(num: number): string {
  return num < 0 ? `(${num})` : `${num}`
}

/** Generate a random number with variable decimal places (0 to maxDecimalPlaces) */
function generateMixedNumber(min: number, max: number, maxDecimalPlaces: number): number {
  // Randomly choose decimal places for this number (0 to maxDecimalPlaces)
  const actualDecimalPlaces = Math.floor(Math.random() * (maxDecimalPlaces + 1))
  const raw = Math.random() * (max - min) + min
  return roundTo(raw, actualDecimalPlaces)
}

/**
 * Generate a random addition/subtraction problem with configurable ranges and operations.
 * 
 * @param sumMin - Minimum value for sum (addition) or minuend (subtraction)
 * @param sumMax - Maximum value for sum (addition) or minuend (subtraction)
 * @param partMin - Minimum value for addends/subtrahend/difference
 * @param partMax - Maximum value for addends/subtrahend/difference
 * @param enableAddition - Whether to enable addition problems
 * @param enableSubtraction - Whether to enable subtraction problems
 * @param decimalPlaces - Number of decimal places (0 for integers)
 * 
 * Note: Future enhancement could include validation logic for:
 * - Range conflicts (e.g., sumMin > sumMax)
 * - Feasibility checks (e.g., ensuring partMax * 2 >= sumMin for addition)
 * - Automatic range adjustment when constraints are impossible
 */
export function generateProblem(
  sumMin = 2,
  sumMax = 20,
  partMin = 1,
  partMax = 10,
  enableAddition = true,
  enableSubtraction = true,
  decimalPlaces = 0,
): AdditionSubtractionProblem {
  // Select operation type
  let op: '+' | '-'
  if (enableAddition && enableSubtraction) {
    op = Math.random() < 0.5 ? '+' : '-'
  } else if (enableAddition) {
    op = '+'
  } else if (enableSubtraction) {
    op = '-'
  } else {
    // Fallback: default to addition if neither is enabled
    op = '+'
  }

  let num1: number
  let num2: number

  if (op === '+') {
    // Addition: a + b = c
    // c (sum) ∈ [sumMin, sumMax]
    // a, b (parts) ∈ [partMin, partMax]
    
    // Ensure sum is achievable with two parts in [partMin, partMax]
    // Minimum possible sum: partMin + partMin = 2 * partMin
    // Maximum possible sum: partMax + partMax = 2 * partMax
    const achievableSumMin = roundTo(2 * partMin, decimalPlaces)
    const achievableSumMax = roundTo(2 * partMax, decimalPlaces)
    
    // Adjust sum range to be achievable
    const actualSumMin = Math.max(sumMin, achievableSumMin)
    const actualSumMax = Math.min(sumMax, achievableSumMax)
    
    // If range is invalid, use fallback
    let finalSumMin = actualSumMin
    let finalSumMax = actualSumMax
    
    if (finalSumMin > finalSumMax) {
      // Fallback: use the achievable range
      finalSumMin = achievableSumMin
      finalSumMax = achievableSumMax
      
      // If still invalid (shouldn't happen), use simple values
      if (finalSumMin > finalSumMax) {
        finalSumMin = partMin
        finalSumMax = partMax
      }
    }
    
    const sum = generateMixedNumber(finalSumMin, finalSumMax, decimalPlaces)
    
    // Calculate valid range for num1 ensuring num2 is also in [partMin, partMax]
    // num1 ∈ [partMin, partMax] AND num2 = sum - num1 ∈ [partMin, partMax]
    // Therefore: max(partMin, sum - partMax) ≤ num1 ≤ min(partMax, sum - partMin)
    const num1Min = Math.max(partMin, roundTo(sum - partMax, decimalPlaces))
    const num1Max = Math.min(partMax, roundTo(sum - partMin, decimalPlaces))
    
    num1 = generateMixedNumber(num1Min, num1Max, decimalPlaces)
    num2 = roundTo(sum - num1, decimalPlaces)
    
    return `${formatNumber(num1)} + ${formatNumber(num2)} = `
  } else {
    // Subtraction: a - b = c
    // a (minuend) ∈ [sumMin, sumMax]
    // b (subtrahend), c (difference) ∈ [partMin, partMax]
    
    // First, ensure we can generate valid values
    // We need: num1 - num2 ∈ [partMin, partMax] where num2 ∈ [partMin, partMax]
    // So: num1 ∈ [partMin + partMin, partMax + partMax] = [2*partMin, 2*partMax]
    // But also: num1 ∈ [sumMin, sumMax]
    // Therefore: num1 ∈ [max(sumMin, 2*partMin), min(sumMax, 2*partMax)]
    
    const actualMinuendMin = Math.max(sumMin, roundTo(2 * partMin, decimalPlaces))
    const actualMinuendMax = Math.min(sumMax, roundTo(2 * partMax, decimalPlaces))
    
    // If range is invalid, use fallback
    let minuendMin = actualMinuendMin
    let minuendMax = actualMinuendMax
    
    if (minuendMin > minuendMax) {
      // Fallback: adjust to ensure feasibility
      minuendMin = Math.max(sumMin, roundTo(partMin + partMin, decimalPlaces))
      minuendMax = Math.min(sumMax, roundTo(partMax + partMax, decimalPlaces))
      
      // If still invalid, use simple approach
      if (minuendMin > minuendMax) {
        minuendMin = sumMin
        minuendMax = sumMax
      }
    }
    
    num1 = generateMixedNumber(minuendMin, minuendMax, decimalPlaces)
    
    // Generate subtrahend ensuring difference is in [partMin, partMax]
    const maxSubtrahend = Math.min(partMax, roundTo(num1 - partMin, decimalPlaces))
    const minSubtrahend = Math.max(partMin, roundTo(num1 - partMax, decimalPlaces))
    
    if (minSubtrahend <= maxSubtrahend) {
      num2 = generateMixedNumber(minSubtrahend, maxSubtrahend, decimalPlaces)
    } else {
      // Fallback: use middle value
      num2 = roundTo((minSubtrahend + maxSubtrahend) / 2, decimalPlaces)
      num2 = Math.max(partMin, Math.min(partMax, num2))
    }
    
    return `${formatNumber(num1)} - ${formatNumber(num2)} = `
  }
}

/**
 * Create a problem generator bound to current store settings.
 * This is used for batch generation to respect user's persisted configuration.
 */
export function createBatchGenerator() {
  const store = useAdditionSubtractionStore()
  return () =>
    generateProblem(
      store.sumMin,
      store.sumMax,
      store.partMin,
      store.partMax,
      store.enableAddition,
      store.enableSubtraction,
      store.decimalPlaces,
    )
}

export const useAdditionSubtractionStore = defineStore(
  'additionSubtraction',
  () => {
    // ========== State ==========

    /** Sum/Minuend minimum value */
    const sumMin = ref(2)
    /** Sum/Minuend maximum value */
    const sumMax = ref(20)
    /** Addend/Subtrahend/Difference minimum value */
    const partMin = ref(1)
    /** Addend/Subtrahend/Difference maximum value */
    const partMax = ref(10)
    /** Enable addition problems */
    const enableAddition = ref(true)
    /** Enable subtraction problems */
    const enableSubtraction = ref(true)
    /** Decimal places (0 for integers) */
    const decimalPlaces = ref(0)

    /** Show navigation arrows */
    const enableArrows = ref(true)
    /** Enable keyboard and swipe navigation */
    const enableNavigation = ref(true)

    const { history, currentIndex, currentItem, count, next, previous, resetToFirst } =
      useQuestionHistory(() =>
        generateProblem(
          sumMin.value,
          sumMax.value,
          partMin.value,
          partMax.value,
          enableAddition.value,
          enableSubtraction.value,
          decimalPlaces.value,
        ),
      )

    // ========== Actions ==========

    /**
     * Validate that at least one operation type is enabled.
     * If both are disabled, re-enable addition as fallback.
     */
    function validateOperators() {
      if (!enableAddition.value && !enableSubtraction.value) {
        enableAddition.value = true
      }
    }

    return {
      // State
      history,
      currentIndex,
      sumMin,
      sumMax,
      partMin,
      partMax,
      enableAddition,
      enableSubtraction,
      decimalPlaces,
      enableArrows,
      enableNavigation,

      // Getters
      currentProblem: currentItem,
      count,

      // Actions
      nextProblem: next,
      previousProblem: previous,
      resetToFirst,
      validateOperators,
    }
  },
  {
    persist: {
      pick: [
        'sumMin',
        'sumMax',
        'partMin',
        'partMax',
        'enableAddition',
        'enableSubtraction',
        'decimalPlaces',
        'enableArrows',
        'enableNavigation',
      ],
      storage: safeStorage,
      afterHydrate: (context) => {
        // Regenerate first problem with persisted settings
        context.store.history[0] = generateProblem(
          context.store.sumMin,
          context.store.sumMax,
          context.store.partMin,
          context.store.partMax,
          context.store.enableAddition,
          context.store.enableSubtraction,
          context.store.decimalPlaces,
        )
      },
    },
  },
)
