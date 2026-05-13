/**
 * Picks a random element from an array.
 * @throws Error if the array is empty
 */
export function pickRandom<T>(arr: T[], rng: RandomSource = Math.random): T {
  if (arr.length === 0) {
    throw new Error('pickRandom: cannot pick from empty array')
  }
  return arr[Math.floor(rng() * arr.length)]!
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(arr: T[], rng: RandomSource = Math.random): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

/**
 * Rounds a number to a specified number of decimal places.
 */
export function roundTo(val: number, dp: number): number {
  return Number(val.toFixed(dp))
}

/**
 * Type definition for a random number source function.
 * Returns a number in the range [0, 1).
 */
export type RandomSource = () => number

/**
 * Creates a seeded random number generator using a simple LCG (Linear Congruential Generator).
 * This provides deterministic randomness for testing and debugging purposes.
 *
 * @param seed - The initial seed value (integer)
 * @returns A function that returns pseudo-random numbers in [0, 1)
 */
export function createSeededRNG(seed: number): RandomSource {
  let state = seed >>> 0 // Ensure unsigned 32-bit integer

  return function seededRandom(): number {
    // LCG parameters (Numerical Recipes)
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296 // 2^32
  }
}
