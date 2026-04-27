/**
 * Picks a random element from an array.
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
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
