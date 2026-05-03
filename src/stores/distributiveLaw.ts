import { defineStore } from 'pinia'
import { ref } from 'vue'
import { safeStorage } from '../utils/storage'
import { pickRandom, shuffleArray, roundTo } from '../utils/math'
import { useQuestionHistory } from '../composables/useQuestionHistory'

/** Problem expression string */
type DistributiveProblem = string

/** Special decimal multiplication pairs for easy calculation */
const SPECIAL_PAIRS: Record<number, number[]> = {
  0.25: [4, 8, 40, 80, 400],
  1.25: [8, 80, 800],
  2.5: [4, 8, 40, 80],
  0.5: [2, 20, 200],
  12.5: [8, 80],
  0.125: [8, 80],
  0.2: [5, 50],
  0.8: [5, 25, 125],
  0.4: [25, 250],
}

/** Split a total into two positive numbers */
function randSplit(total: number, dp: number): [number, number] {
  const part1 = roundTo(Math.random() * (total * 0.8 - total * 0.2) + total * 0.2, dp)
  const part2 = roundTo(total - part1, dp)
  return [part1, part2]
}

/** Generate expand problem: a × (b ± c) */
function generateExpand(maxValue: number, dp: number, trapRate: number): DistributiveProblem {
  // Check if should generate trap problem
  if (Math.random() < trapRate) {
    // Trap problem: parentheses can be calculated directly
    const a = pickRandom([0.5, 2, 3, 10, 0.2, 5])
    const target = pickRandom([10, 20, 50, 100, 1, 2, 5])

    let b: number
    if (target > 2) {
      b = Math.floor(Math.random() * (target - 1)) + 1
    } else {
      b = Math.random() * (target - 0.1) + 0.1
    }
    b = roundTo(b, dp)

    const op = Math.random() < 0.5 ? '+' : '-'
    let c: number
    if (op === '+') {
      c = roundTo(target - b, dp)
    } else {
      c = b - target
      if (c < 0) {
        ;[b, c] = [c + target, Math.abs(c)]
      }
    }

    return `${a} × (${b} ${op} ${c}) =`
  }

  // Normal problem: choose strategy
  const strategy = Math.random() < 0.5 ? 'special' : 'near_int'

  if (strategy === 'special') {
    // Special decimal expansion: 1.25×(80+8)
    const keys = Object.keys(SPECIAL_PAIRS).map(Number)
    const a = pickRandom(keys)
    const pairs = SPECIAL_PAIRS[a]

    if (!pairs || pairs.length < 2) {
      return generateExpand(maxValue, dp, trapRate)
    }

    // Pick two distinct indices
    const indices = (
      pairs.length === 2 ? [0, 1] : shuffleArray([...Array(pairs.length).keys()]).slice(0, 2)
    ) as [number, number]
    const b = pairs[indices[0]]!
    const c = pairs[indices[1]]!

    if (a * (b + c) > maxValue) {
      return generateExpand(maxValue, dp, trapRate)
    }

    const op = Math.random() < 0.5 ? '+' : '-'
    return `${a} × (${b} ${op} ${c}) =`
  } else {
    // Near integer split: 3.5 × 9.9 = 3.5×(10-0.1)
    const a = pickRandom([0.5, 1.5, 2.5, 3.5, 6, 8, 0.6, 25, 2])
    const [base, adj] = pickRandom([
      [10, -0.1],
      [10, 0.1],
      [100, 0.2],
      [100, -2],
      [20, -0.2],
      [50, -0.5],
      [200, 2],
      [30, -0.3],
    ])

    if (a * Math.abs(base + adj) > maxValue) {
      return generateExpand(maxValue, dp, trapRate)
    }

    const op = adj > 0 ? '+' : '-'
    return `${a} × (${base} ${op} ${Math.abs(adj)}) =`
  }
}

/** Generate factor problem: a×b ± a×c */
function generateFactor(maxValue: number, dp: number, swapRate: number): DistributiveProblem {
  const keys = Object.keys(SPECIAL_PAIRS).map(Number)
  const a = pickRandom(keys)
  const pairs = SPECIAL_PAIRS[a]

  if (!pairs || pairs.length === 0) {
    return generateFactor(maxValue, dp, swapRate)
  }

  const targetSum = pickRandom(pairs)

  if (!targetSum || targetSum <= 2) {
    return generateFactor(maxValue, dp, swapRate)
  }

  const [b, c] = randSplit(targetSum, dp)

  if (a * Math.max(b, c) > maxValue) {
    return generateFactor(maxValue, dp, swapRate)
  }

  const op = Math.random() < 0.5 ? '+' : '-'
  let expression: string

  if (op === '+') {
    expression = `${a}×${b} + ${a}×${c}`
  } else {
    // For subtraction: b - c = targetSum
    const cVal = roundTo(Math.random() * 49 + 1, dp)
    const bVal = roundTo(cVal + targetSum, dp)

    if (bVal > maxValue / a) {
      return generateFactor(maxValue, dp, swapRate)
    }

    expression = `${a}×${bVal} - ${a}×${cVal}`
  }

  // Check if should apply swap
  if (Math.random() < swapRate) {
    // Swap multiplication order: 37×1.25 + 63×1.25
    const parts = expression.split(op === '+' ? '+' : '-')
    const swapMul = (term: string) => {
      const trimmed = term.trim()
      if (trimmed.includes('×')) {
        const [x, y] = trimmed.split('×')
        return `${y!.trim()}×${x!.trim()}`
      }
      return trimmed
    }
    return `${swapMul(parts[0]!)} ${op} ${swapMul(parts[1]!)} =`
  }

  return `${expression} =`
}

/** Generate random distributive law problem (mix expand and factor) */
export function generateProblem(
  maxPower = 3,
  decimalPlaces = 1,
  enableTrap = false,
  enableSwap = false,
): DistributiveProblem {
  const maxValue = Math.pow(10, maxPower)
  const isExpand = Math.random() < 0.5
  return isExpand
    ? generateExpand(maxValue, decimalPlaces, enableTrap ? 0.2 : 0)
    : generateFactor(maxValue, decimalPlaces, enableSwap ? 0.2 : 0)
}

/**
 * Create a problem generator bound to current store settings.
 * This is used for batch generation to respect user's persisted configuration.
 */
export function createBatchGenerator() {
  const store = useDistributiveLawStore()
  return () =>
    generateProblem(store.maxPower, store.decimalPlaces, store.enableTrap, store.enableSwap)
}

export const useDistributiveLawStore = defineStore(
  'distributiveLaw',
  () => {
    // ========== State ==========

    /** Enable trap problems */
    const enableTrap = ref(false)
    /** Enable swap interference */
    const enableSwap = ref(false)
    /** Maximum value exponent (10^maxPower) */
    const maxPower = ref(3)
    /** Decimal places */
    const decimalPlaces = ref(1)

    /** Show navigation arrows */
    const enableArrows = ref(true)
    /** Enable keyboard and swipe navigation */
    const enableNavigation = ref(true)

    const { history, currentIndex, currentItem, count, next, previous, resetToFirst } =
      useQuestionHistory(() =>
        generateProblem(maxPower.value, decimalPlaces.value, enableTrap.value, enableSwap.value),
      )

    // ========== Actions ==========

    /** Toggle setting (trap or swap) and regenerate problem */
    function toggleSetting(setting: 'trap' | 'swap') {
      if (setting === 'trap') enableTrap.value = !enableTrap.value
      else enableSwap.value = !enableSwap.value
      history.value[currentIndex.value] = generateProblem(
        maxPower.value,
        decimalPlaces.value,
        enableTrap.value,
        enableSwap.value,
      )
    }

    /** Update numeric setting and regenerate problem */
    function updateSetting(setting: 'maxPower' | 'decimalPlaces', value: number) {
      if (setting === 'maxPower') maxPower.value = value
      else decimalPlaces.value = value
      history.value[currentIndex.value] = generateProblem(
        maxPower.value,
        decimalPlaces.value,
        enableTrap.value,
        enableSwap.value,
      )
    }

    return {
      // State
      history,
      currentIndex,
      enableTrap,
      enableSwap,
      maxPower,
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
      toggleTrap: () => toggleSetting('trap'),
      toggleSwap: () => toggleSetting('swap'),
      updateMaxPower: (v: number) => updateSetting('maxPower', v),
      updateDecimalPlaces: (v: number) => updateSetting('decimalPlaces', v),
    }
  },
  {
    persist: {
      pick: [
        'enableTrap',
        'enableSwap',
        'maxPower',
        'decimalPlaces',
        'enableArrows',
        'enableNavigation',
      ],
      storage: safeStorage,
      afterHydrate: (context) => {
        // Regenerate first problem with persisted settings
        context.store.history[0] = generateProblem(
          context.store.maxPower,
          context.store.decimalPlaces,
          context.store.enableTrap,
          context.store.enableSwap,
        )
      },
    },
  },
)
