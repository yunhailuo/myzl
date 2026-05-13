import { describe, it, expect } from 'vitest'
import { createSeededRNG, pickRandom, shuffleArray } from './math'

describe('math utilities', () => {
  describe('createSeededRNG', () => {
    it('should produce the same sequence with the same seed', () => {
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(42)

      const seq1 = []
      const seq2 = []

      for (let i = 0; i < 10; i++) {
        seq1.push(rng1())
        seq2.push(rng2())
      }

      expect(seq1).toEqual(seq2)
    })

    it('should produce different sequences with different seeds', () => {
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(99)

      const seq1 = []
      const seq2 = []

      for (let i = 0; i < 10; i++) {
        seq1.push(rng1())
        seq2.push(rng2())
      }

      expect(seq1).not.toEqual(seq2)
    })

    it('should return values in range [0, 1)', () => {
      const rng = createSeededRNG(123)

      for (let i = 0; i < 100; i++) {
        const val = rng()
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThan(1)
      }
    })
  })

  describe('pickRandom', () => {
    it('should pick an element from array', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = pickRandom(arr)
      expect(arr).toContain(result)
    })

    it('should throw error for empty array', () => {
      expect(() => pickRandom([])).toThrow('pickRandom: cannot pick from empty array')
    })

    it('should be deterministic with seeded RNG', () => {
      const arr = ['a', 'b', 'c', 'd', 'e']
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(42)

      const results1 = []
      const results2 = []

      for (let i = 0; i < 10; i++) {
        results1.push(pickRandom(arr, rng1))
        results2.push(pickRandom(arr, rng2))
      }

      expect(results1).toEqual(results2)
    })
  })

  describe('shuffleArray', () => {
    it('should preserve array length', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(arr)
      expect(shuffled.length).toBe(arr.length)
    })

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(arr)
      expect(shuffled.sort()).toEqual(arr.sort())
    })

    it('should not modify the original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      shuffleArray(arr)
      expect(arr).toEqual(original)
    })

    it('should be deterministic with seeded RNG', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(42)

      const shuffled1 = shuffleArray(arr, rng1)
      const shuffled2 = shuffleArray(arr, rng2)

      expect(shuffled1).toEqual(shuffled2)
    })

    it('should produce different shuffles with different seeds', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const rng1 = createSeededRNG(42)
      const rng2 = createSeededRNG(99)

      const shuffled1 = shuffleArray(arr, rng1)
      const shuffled2 = shuffleArray(arr, rng2)

      // Very unlikely to be the same with different seeds
      expect(shuffled1).not.toEqual(shuffled2)
    })

    it('should handle empty array', () => {
      const result = shuffleArray([])
      expect(result).toEqual([])
    })

    it('should handle single element array', () => {
      const arr = [42]
      const result = shuffleArray(arr)
      expect(result).toEqual([42])
    })
  })
})
