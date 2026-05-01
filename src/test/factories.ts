/**
 * Test data factories for consistent test data generation.
 * These utilities help create predictable test data across different test suites.
 */

/**
 * Generate a random integer within a range (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a random arithmetic question
 */
export function generateArithmeticQuestion(operations: Array<'+' | '-'> = ['+', '-']): {
  num1: number
  num2: number
  op: string
  answer: number
} {
  const opIndex = randomInt(0, operations.length - 1)
  const op = operations[opIndex] ?? '+'
  let num1 = randomInt(1, 19)
  let num2 = randomInt(1, 19)

  // Ensure non-negative results for subtraction
  if (op === '-' && num1 < num2) {
    ;[num1, num2] = [num2, num1]
  }

  const answer = op === '+' ? num1 + num2 : num1 - num2

  return { num1, num2, op, answer }
}

/**
 * Generate multiple unique arithmetic questions
 */
export function generateUniqueQuestions(
  count: number,
  operations?: Array<'+' | '-'>,
): ReturnType<typeof generateArithmeticQuestion>[] {
  const questions: ReturnType<typeof generateArithmeticQuestion>[] = []
  const seen = new Set<string>()

  while (questions.length < count) {
    const question = generateArithmeticQuestion(operations)
    const key = `${question.num1}${question.op}${question.num2}`

    if (!seen.has(key)) {
      seen.add(key)
      questions.push(question)
    }
  }

  return questions
}

/**
 * Create a mock Hanzi character object for testing
 */
export function createMockCharacter(
  char: string,
  pinyin: string = 'test',
): {
  char: string
  pinyin: string
  words: string[]
} {
  return {
    char,
    pinyin,
    words: ['测试词1', '测试词2'],
  }
}

/**
 * Generate a set of mock characters for testing
 */
export function generateMockCharacters(count: number): ReturnType<typeof createMockCharacter>[] {
  const chars = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const characters: ReturnType<typeof createMockCharacter>[] = []

  for (let i = 0; i < count; i++) {
    const char = chars[i % chars.length]!
    characters.push(createMockCharacter(char, `pinyin${i}`))
  }

  return characters
}

/**
 * Create a mock distributive law problem
 */
export function createDistributiveProblem(options?: {
  type?: 'expand' | 'factor'
  maxValue?: number
}): string {
  const type = options?.type || (Math.random() < 0.5 ? 'expand' : 'factor')
  const maxValue = options?.maxValue || 1000

  if (type === 'expand') {
    // a × (b ± c)
    const a = [0.5, 1.25, 2.5, 3.5][randomInt(0, 3)]
    const b = randomInt(1, Math.floor(maxValue / 10))
    const c = randomInt(1, Math.floor(maxValue / 10))
    const op = Math.random() < 0.5 ? '+' : '-'
    return `${a} × (${b} ${op} ${c})`
  } else {
    // a×b ± a×c
    const a = [0.25, 1.25, 2.5][randomInt(0, 2)]
    const b = randomInt(1, Math.floor(maxValue / 10))
    const c = randomInt(1, Math.floor(maxValue / 10))
    const op = Math.random() < 0.5 ? '+' : '-'
    return `${a}×${b} ${op} ${a}×${c}`
  }
}

/**
 * Create a mock linear equation
 */
export function createLinearEquation(options?: { variable?: string }): string {
  const variable = options?.variable || 'x'
  const A = randomInt(1, 5)
  const C = randomInt(1, 5)
  const sol = randomInt(-4, 4) || 1 // Avoid zero

  let B = randomInt(-10, 10) || 1
  let D = B + (A - C) * sol

  // Ensure D is within valid range and not zero
  if (D === 0 || D < -10 || D > 10) {
    B = 1
    D = B + (A - C) * sol
  }

  // Format with proper signs
  const formatTerm = (coeff: number, isVar: boolean): string => {
    const absCoeff = Math.abs(coeff)
    const sign = coeff >= 0 ? '+' : '-'
    const varPart = isVar ? variable : ''
    return `${sign} ${absCoeff}${varPart}`
  }

  // Build equation: Ax + B = Cx + D
  const leftSide = `${A}${variable} ${formatTerm(B, false)}`
  const rightSide = `${C}${variable} ${formatTerm(D, false)}`

  return `${leftSide} = ${rightSide}`
}
