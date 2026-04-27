import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { safeStorage } from './storage'

describe('safeStorage', () => {
  let localStorageMock: Storage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getItemSpy: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let setItemSpy: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let removeItemSpy: any

  beforeEach(() => {
    // Create a mock localStorage
    const store: Record<string, string> = {}
    localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString()
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key])
      }),
      length: 0,
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
    } as unknown as Storage

    getItemSpy = vi.spyOn(localStorageMock, 'getItem')
    setItemSpy = vi.spyOn(localStorageMock, 'setItem')
    removeItemSpy = vi.spyOn(localStorageMock, 'removeItem')

    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getItem', () => {
    it('should return value when key exists', () => {
      localStorageMock.setItem('test-key', 'test-value')

      const result = safeStorage.getItem('test-key')

      expect(result).toBe('test-value')
      expect(getItemSpy).toHaveBeenCalledWith('test-key')
    })

    it('should return null when key does not exist', () => {
      const result = safeStorage.getItem('non-existent-key')

      expect(result).toBeNull()
      expect(getItemSpy).toHaveBeenCalledWith('non-existent-key')
    })

    it('should return null when localStorage throws error', () => {
      getItemSpy.mockImplementationOnce(() => {
        throw new Error('Storage access denied')
      })

      const result = safeStorage.getItem('test-key')

      expect(result).toBeNull()
    })
  })

  describe('setItem', () => {
    it('should set value successfully', () => {
      safeStorage.setItem('test-key', 'test-value')

      expect(setItemSpy).toHaveBeenCalledWith('test-key', 'test-value')
      expect(localStorageMock.getItem('test-key')).toBe('test-value')
    })

    it('should handle errors gracefully without throwing', () => {
      setItemSpy.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded')
      })

      // Should not throw
      expect(() => {
        safeStorage.setItem('test-key', 'test-value')
      }).not.toThrow()
    })
  })

  describe('removeItem', () => {
    it('should remove existing key', () => {
      localStorageMock.setItem('test-key', 'test-value')

      safeStorage.removeItem('test-key')

      expect(removeItemSpy).toHaveBeenCalledWith('test-key')
      expect(localStorageMock.getItem('test-key')).toBeNull()
    })

    it('should handle errors gracefully when removing non-existent key', () => {
      removeItemSpy.mockImplementationOnce(() => {
        throw new Error('Storage access denied')
      })

      // Should not throw
      expect(() => {
        safeStorage.removeItem('non-existent-key')
      }).not.toThrow()
    })
  })
})
