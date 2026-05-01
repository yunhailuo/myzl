/// <reference types="node" />

import { describe, it, expect } from 'vitest'
import {
  generateArithmeticQuestion,
  createDistributiveProblem,
  createLinearEquation,
} from './factories'

describe('Performance Tests', () => {
  describe('Question Generation Performance', () => {
    it('should generate arithmetic questions quickly', () => {
      const iterations = 10000
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        generateArithmeticQuestion()
      }

      const end = performance.now()
      const duration = end - start

      // Should generate 10k questions in under 100ms
      expect(duration).toBeLessThan(100)
      console.log(`Generated ${iterations} arithmetic questions in ${duration.toFixed(2)}ms`)
    })

    it('should generate distributive law problems efficiently', () => {
      const iterations = 5000
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        createDistributiveProblem()
      }

      const end = performance.now()
      const duration = end - start

      // Should generate 5k problems in under 100ms
      expect(duration).toBeLessThan(100)
      console.log(`Generated ${iterations} distributive problems in ${duration.toFixed(2)}ms`)
    })

    it('should generate linear equations efficiently', () => {
      const iterations = 5000
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        createLinearEquation()
      }

      const end = performance.now()
      const duration = end - start

      // Should generate 5k equations in under 100ms
      expect(duration).toBeLessThan(100)
      console.log(`Generated ${iterations} linear equations in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Unique Question Generation Performance', () => {
    it('should generate unique questions without excessive retries', () => {
      const count = 100
      const start = performance.now()

      const questions = []
      const seen = new Set<string>()

      while (questions.length < count) {
        const q = generateArithmeticQuestion()
        const key = `${q.num1}${q.op}${q.num2}`

        if (!seen.has(key)) {
          seen.add(key)
          questions.push(q)
        }
      }

      const end = performance.now()
      const duration = end - start

      // Should generate 100 unique questions in under 50ms
      expect(duration).toBeLessThan(50)
      expect(questions).toHaveLength(count)
      console.log(`Generated ${count} unique questions in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory during repeated generation', () => {
      // Skip memory test in browser environment
      if (typeof process === 'undefined') {
        console.log('Memory test skipped in browser environment')
        return
      }

      const initialMemory = process.memoryUsage().heapUsed

      // Generate many questions
      for (let i = 0; i < 50000; i++) {
        generateArithmeticQuestion()
      }

      // Force garbage collection if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((global as any).gc) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(global as any).gc()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (< 10MB for 50k operations)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
    })
  })
})
