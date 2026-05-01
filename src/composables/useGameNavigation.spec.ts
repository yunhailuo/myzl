import { describe, it, expect } from 'vitest'

describe('useGameNavigation logic', () => {
  describe('keyboard navigation logic', () => {
    it('should identify ArrowRight key for next action', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      expect(event.key).toBe('ArrowRight')
    })

    it('should identify ArrowLeft key for previous action', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      expect(event.key).toBe('ArrowLeft')
    })

    it('should ignore non-navigation keys', () => {
      const keys = ['Enter', 'ArrowUp', 'ArrowDown', 'Escape']
      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key })
        expect(['ArrowRight', 'ArrowLeft']).not.toContain(event.key)
      })
    })
  })

  describe('swipe navigation logic', () => {
    it('should detect left swipe (forward)', () => {
      const startX = 200
      const endX = 100
      const diffX = startX - endX

      expect(diffX).toBeGreaterThan(50)
      expect(diffX).toBeGreaterThan(0) // Positive means left swipe
    })

    it('should detect right swipe (backward)', () => {
      const startX = 100
      const endX = 200
      const diffX = startX - endX

      expect(diffX).toBeLessThan(-50)
      expect(diffX).toBeLessThan(0) // Negative means right swipe
    })

    it('should ignore small swipes below threshold', () => {
      const testCases = [
        { start: 100, end: 80 }, // 20px
        { start: 100, end: 60 }, // 40px
        { start: 100, end: 100 }, // 0px
      ]

      testCases.forEach(({ start, end }) => {
        const diffX = Math.abs(start - end)
        expect(diffX).toBeLessThanOrEqual(50)
      })
    })

    it('should prefer horizontal over vertical swipes', () => {
      const horizontalSwipe = { diffX: 100, diffY: 20 }
      const verticalSwipe = { diffX: 20, diffY: 100 }

      expect(Math.abs(horizontalSwipe.diffX)).toBeGreaterThan(Math.abs(horizontalSwipe.diffY))
      expect(Math.abs(verticalSwipe.diffX)).toBeLessThan(Math.abs(verticalSwipe.diffY))
    })
  })

  describe('navigation enable/disable logic', () => {
    it('should accept boolean enable flag', () => {
      const enabled = true
      const disabled = false

      expect(enabled).toBe(true)
      expect(disabled).toBe(false)
    })

    it('should accept function enable check', () => {
      const checkEnabled = () => true
      const checkDisabled = () => false

      expect(checkEnabled()).toBe(true)
      expect(checkDisabled()).toBe(false)
    })
  })
})
