import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest'
import { playTickSound, playCompleteSound } from './audio'

// Mock Oscillator
const mockOscillator = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  frequency: {
    value: 0,
    linearRampToValueAtTime: vi.fn(),
  },
  type: '',
}

// Mock GainNode
const mockGainNode = {
  connect: vi.fn(),
  gain: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
}

// Mock AudioContext instance
const mockAudioContext = {
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGainNode),
  destination: {},
  currentTime: 0,
  close: vi.fn(() => Promise.resolve()),
}

// Mock AudioContext as a class (function constructor)
class MockAudioContext {
  constructor() {
    return mockAudioContext
  }
}

describe('Audio Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window.AudioContext as a class
    vi.stubGlobal('AudioContext', MockAudioContext)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('playTickSound', () => {
    it('should create oscillator with correct frequency', () => {
      playTickSound()

      expect(mockAudioContext.createOscillator).toHaveBeenCalled()
      expect(mockOscillator.frequency.value).toBe(1200)
      expect(mockOscillator.type).toBe('sine')
    })

    it('should connect oscillator to gain node and destination', () => {
      playTickSound()

      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode)
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination)
    })

    it('should set gain values for fade out', () => {
      playTickSound()

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.45, expect.any(Number))
      expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.01, 0.18)
    })

    it('should start and stop oscillator', () => {
      playTickSound()

      expect(mockOscillator.start).toHaveBeenCalled()
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.18)
    })

    it('should report audio errors without interrupting the timer', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubGlobal(
        'AudioContext',
        vi.fn(() => {
          throw new Error('Audio not supported')
        }),
      )

      expect(() => playTickSound()).not.toThrow()
      expect(warn).toHaveBeenCalledWith('Unable to play timer audio', expect.any(Error))
    })

    it('should not play if window is undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error Testing undefined window
      delete global.window

      playTickSound()

      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled()

      global.window = originalWindow
    })
  })

  describe('playCompleteSound', () => {
    it('should create oscillator with rising frequency', () => {
      playCompleteSound()

      expect(mockAudioContext.createOscillator).toHaveBeenCalled()
      expect(mockOscillator.frequency.value).toBe(750)
      expect(mockOscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(1350, 0.6)
    })

    it('should set gain values for fade out', () => {
      playCompleteSound()

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.55, expect.any(Number))
      expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.01, 0.6)
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.6)
    })

    it('should report audio errors without interrupting the timer', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      vi.stubGlobal(
        'AudioContext',
        vi.fn(() => {
          throw new Error('Audio not supported')
        }),
      )

      expect(() => playCompleteSound()).not.toThrow()
      expect(warn).toHaveBeenCalledWith('Unable to play timer audio', expect.any(Error))
    })
  })
})
