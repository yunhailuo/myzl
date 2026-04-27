import { describe, it, expect } from 'vitest'
import {
  randomInt,
  generateArithmeticQuestion,
  generateUniqueQuestions,
  createMockCharacter,
  generateMockCharacters,
  createDistributiveProblem,
  createLinearEquation,
} from './factories'

describe('Test Factories', () => {
  describe('randomInt', () => {
    it('should generate integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(1, 10)
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(10)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it('should handle negative ranges', () => {
      for (let i = 0; i < 50; i++) {
        const value = randomInt(-10, -1)
        expect(value).toBeGreaterThanOrEqual(-10)
        expect(value).toBeLessThanOrEqual(-1)
      }
    })
  })

  describe('generateArithmeticQuestion', () => {
    it('should generate valid addition questions', () => {
      const question = generateArithmeticQuestion(['+'])

      expect(question.op).toBe('+')
      expect(question.answer).toBe(question.num1 + question.num2)
    })

    it('should generate valid subtraction questions with non-negative results', () => {
      for (let i = 0; i < 50; i++) {
        const question = generateArithmeticQuestion(['-'])

        expect(question.op).toBe('-')
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.num1).toBeGreaterThanOrEqual(question.num2)
      }
    })

    it('should generate mixed operations by default', () => {
      let hasAddition = false
      let hasSubtraction = false

      for (let i = 0; i < 30; i++) {
        const question = generateArithmeticQuestion()
        if (question.op === '+') hasAddition = true
        if (question.op === '-') hasSubtraction = true
      }

      expect(hasAddition).toBe(true)
      expect(hasSubtraction).toBe(true)
    })
  })

  describe('generateUniqueQuestions', () => {
    it('should generate unique questions', () => {
      const questions = generateUniqueQuestions(10)

      expect(questions).toHaveLength(10)

      const keys = new Set(questions.map((q) => `${q.num1}${q.op}${q.num2}`))
      expect(keys.size).toBe(10)
    })

    it('should respect operation filter', () => {
      const questions = generateUniqueQuestions(5, ['+'])

      questions.forEach((q) => {
        expect(q.op).toBe('+')
      })
    })
  })

  describe('createMockCharacter', () => {
    it('should create character object with defaults', () => {
      const char = createMockCharacter('汉')

      expect(char.char).toBe('汉')
      expect(char.pinyin).toBe('test')
      expect(char.words).toHaveLength(2)
    })

    it('should accept custom pinyin', () => {
      const char = createMockCharacter('字', 'zì')

      expect(char.pinyin).toBe('zì')
    })
  })

  describe('generateMockCharacters', () => {
    it('should generate specified number of characters', () => {
      const characters = generateMockCharacters(5)

      expect(characters).toHaveLength(5)
    })

    it('should generate unique characters up to alphabet length', () => {
      const characters = generateMockCharacters(26)

      const chars = new Set(characters.map((c) => c.char))
      expect(chars.size).toBe(26)
    })
  })

  describe('createDistributiveProblem', () => {
    it('should generate expand type problems', () => {
      const problem = createDistributiveProblem({ type: 'expand' })

      expect(problem).toContain('×')
      expect(problem).toContain('(')
    })

    it('should generate factor type problems', () => {
      const problem = createDistributiveProblem({ type: 'factor' })

      expect(problem).toContain('×')
      // Factor problems should not have parentheses in standard form
      expect(problem.match(/×.*[+-].*×/)).not.toBeNull()
    })

    it('should generate mixed types by default', () => {
      let hasExpand = false
      let hasFactor = false

      for (let i = 0; i < 20; i++) {
        const problem = createDistributiveProblem()
        if (problem.includes('(')) hasExpand = true
        else hasFactor = true
      }

      expect(hasExpand).toBe(true)
      expect(hasFactor).toBe(true)
    })
  })

  describe('createLinearEquation', () => {
    it('should generate equation with equals sign', () => {
      const equation = createLinearEquation()

      expect(equation).toContain('=')
    })

    it('should use custom variable when provided', () => {
      const equation = createLinearEquation({ variable: 'y' })

      expect(equation).toContain('y')
    })

    it('should generate valid equation format', () => {
      const equation = createLinearEquation()

      // Should match pattern: Ax + B = Cx + D
      expect(equation).toMatch(/\d+[a-z]\s*[+-]\s*\d+\s*=\s*\d+[a-z]\s*[+-]\s*\d+/)
    })
  })
})
