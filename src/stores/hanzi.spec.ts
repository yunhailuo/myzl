import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useHanziStore } from './hanzi'
import charactersData from '../data/characters.json'

describe('hanzi Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should initialize with enabled sets from data file', () => {
      const store = useHanziStore()
      const expectedEnabledIds = charactersData.characterSets
        .filter((set) => set.enabled)
        .map((set) => set.id)

      expect(store.enabledSetIds).toEqual(expectedEnabledIds)
    })

    it('should have shuffled characters loaded', () => {
      const store = useHanziStore()
      expect(store.shuffledCharacters.length).toBeGreaterThan(0)
    })

    it('should start at index 0', () => {
      const store = useHanziStore()
      expect(store.currentIndex).toBe(0)
    })

    it('should have default settings enabled', () => {
      const store = useHanziStore()
      expect(store.enableArrows).toBe(true)
      expect(store.enableNavigation).toBe(true)
      expect(store.showPinyin).toBe(true)
      expect(store.showWords).toBe(true)
      expect(store.loopAnimation).toBe(true)
    })

    it('should have currentCharacter matching first shuffled character', () => {
      const store = useHanziStore()
      expect(store.currentCharacter).toBe(store.shuffledCharacters[0])
    })

    it('should provide availableSets including custom set', () => {
      const store = useHanziStore()
      // Should include all built-in sets plus custom set
      expect(store.availableSets.length).toBe(charactersData.characterSets.length + 1)
      
      // Check that all built-in sets are present
      charactersData.characterSets.forEach(builtInSet => {
        const found = store.availableSets.find(s => s.id === builtInSet.id)
        expect(found).toBeDefined()
        expect(found?.name).toBe(builtInSet.name)
      })
      
      // Check custom set is present
      const customSet = store.availableSets.find(s => s.id === 'custom')
      expect(customSet).toBeDefined()
      expect(customSet?.name).toContain('自定义')
    })
  })

  describe('shuffleArray utility', () => {
    it('should return array of same length', () => {
      const store = useHanziStore()
      const original = ['a', 'b', 'c', 'd', 'e']
      const shuffled = store.shuffledCharacters.slice(0, 5)

      expect(shuffled.length).toBe(original.length)
    })

    it('should contain same elements as original', () => {
      const store = useHanziStore()
      // Get characters from enabled sets
      const allChars = charactersData.characterSets
        .filter((set) => store.enabledSetIds.includes(set.id))
        .flatMap((set) => set.data.split(''))

      expect(store.shuffledCharacters.sort()).toEqual(allChars.sort())
    })
  })

  describe('loadCharacters', () => {
    it('should load and shuffle characters from enabled sets', () => {
      const store = useHanziStore()
      const initialLength = store.shuffledCharacters.length

      store.loadCharacters()

      expect(store.shuffledCharacters.length).toBe(initialLength)
      expect(store.currentIndex).toBe(0)
    })

    it('should reset currentIndex to 0', () => {
      const store = useHanziStore()

      store.nextCharacter()
      store.nextCharacter()
      expect(store.currentIndex).toBeGreaterThan(0)

      store.loadCharacters()
      expect(store.currentIndex).toBe(0)
    })

    it('should only include characters from enabled sets', () => {
      const store = useHanziStore()

      // Disable all sets
      store.enabledSetIds = []
      store.loadCharacters()

      expect(store.shuffledCharacters.length).toBe(0)
    })
  })

  describe('reshuffleCharacters', () => {
    it('should reshuffle and reset to first character', () => {
      const store = useHanziStore()
      const firstShuffle = [...store.shuffledCharacters]

      store.reshuffleCharacters()

      expect(store.currentIndex).toBe(0)
      // Shuffled order should likely be different (statistically)
      expect(store.shuffledCharacters).not.toEqual(firstShuffle)
    })
  })

  describe('toggleCharacterSet', () => {
    it('should disable an enabled set', () => {
      const store = useHanziStore()
      const firstSetId = store.enabledSetIds[0]

      expect(firstSetId).toBeDefined()
      store.toggleCharacterSet(firstSetId!)
      expect(store.enabledSetIds).not.toContain(firstSetId)
    })

    it('should enable a disabled set', () => {
      const store = useHanziStore()
      const allIds = store.availableSets.map((set) => set.id)
      const disabledId = allIds.find((id) => !store.enabledSetIds.includes(id))

      expect(disabledId).toBeDefined()
      store.toggleCharacterSet(disabledId!)
      expect(store.enabledSetIds).toContain(disabledId)
    })

    it('should reload characters after toggling', () => {
      const store = useHanziStore()
      const initialLength = store.shuffledCharacters.length

      // Ensure at least 2 sets are enabled for this test
      if (store.enabledSetIds.length < 2) {
        const allIds = store.availableSets.map((set) => set.id)
        const disabledId = allIds.find((id) => !store.enabledSetIds.includes(id))
        if (disabledId) {
          store.toggleCharacterSet(disabledId)
        }
      }

      expect(store.enabledSetIds.length).toBeGreaterThanOrEqual(2)
      const firstSetId = store.enabledSetIds[0]
      store.toggleCharacterSet(firstSetId!)
      expect(store.shuffledCharacters.length).not.toBe(initialLength)
    })
  })

  describe('toggleAllSets', () => {
    it('should enable all sets when not all are enabled', () => {
      const store = useHanziStore()
      const allIds = store.availableSets.map((set) => set.id)

      // Disable one set first
      if (store.enabledSetIds.length > 0) {
        const firstId = store.enabledSetIds[0]
        if (firstId) {
          store.toggleCharacterSet(firstId)
        }
      }

      store.toggleAllSets()

      expect(store.enabledSetIds).toEqual(allIds)
    })

    it('should disable all sets when all are enabled', () => {
      const store = useHanziStore()
      const allIds = store.availableSets.map((set) => set.id)

      // Enable all sets
      store.enabledSetIds = [...allIds]

      store.toggleAllSets()

      expect(store.enabledSetIds).toEqual([])
    })

    it('should reload characters after toggling all', () => {
      const store = useHanziStore()
      const initialLength = store.shuffledCharacters.length

      store.toggleAllSets()

      expect(store.shuffledCharacters.length).not.toBe(initialLength)
    })
  })

  describe('navigation', () => {
    it('should move to next character', () => {
      const store = useHanziStore()

      store.nextCharacter()
      expect(store.currentIndex).toBe(1)
    })

    it('should not go beyond last character', () => {
      const store = useHanziStore()
      const lastIndex = store.shuffledCharacters.length - 1

      // Try to go beyond the end
      for (let i = 0; i < 10; i++) {
        store.nextCharacter()
      }

      expect(store.currentIndex).toBeLessThanOrEqual(lastIndex)
    })

    it('should move to previous character', () => {
      const store = useHanziStore()

      store.nextCharacter()
      store.nextCharacter()
      expect(store.currentIndex).toBe(2)

      store.previousCharacter()
      expect(store.currentIndex).toBe(1)
    })

    it('should not go below index 0', () => {
      const store = useHanziStore()

      store.previousCharacter()
      expect(store.currentIndex).toBe(0)
    })

    it('should reset to first character', () => {
      const store = useHanziStore()

      store.nextCharacter()
      store.nextCharacter()
      store.nextCharacter()
      expect(store.currentIndex).toBe(3)

      store.resetToFirst()
      expect(store.currentIndex).toBe(0)
    })
  })

  describe('persistence', () => {
    it('should persist all state fields', () => {
      const store = useHanziStore()

      store.enableArrows = false
      store.enableNavigation = false
      store.showPinyin = false
      store.showWords = false
      store.loopAnimation = false

      expect(store.$state.enableArrows).toBe(false)
      expect(store.$state.enableNavigation).toBe(false)
      expect(store.$state.showPinyin).toBe(false)
      expect(store.$state.showWords).toBe(false)
      expect(store.$state.loopAnimation).toBe(false)
    })
  })

  describe('custom character set', () => {
    it('should initialize with empty custom character set', () => {
      const store = useHanziStore()
      expect(store.customCharacterSet).toBe('')
      expect(store.enabledSetIds).not.toContain('custom')
    })

    it('should include custom set in availableSets', () => {
      const store = useHanziStore()
      const customSet = store.availableSets.find(set => set.id === 'custom')
      
      expect(customSet).toBeDefined()
      expect(customSet?.name).toContain('自定义')
    })

    it('should update custom character set', () => {
      const store = useHanziStore()
      const customChars = '天地玄黄'

      store.updateCustomCharacterSet(customChars)
      expect(store.customCharacterSet).toBe(customChars)
    })

    it('should toggle custom set via toggleCharacterSet', () => {
      const store = useHanziStore()

      store.toggleCharacterSet('custom')
      expect(store.enabledSetIds).toContain('custom')

      store.toggleCharacterSet('custom')
      expect(store.enabledSetIds).not.toContain('custom')
    })

    it('should include custom characters when enabled', () => {
      const store = useHanziStore()
      const customChars = '测试汉字'

      // Disable all built-in sets
      store.enabledSetIds = []
      
      // Enable custom set and set characters
      store.toggleCharacterSet('custom')
      store.updateCustomCharacterSet(customChars)

      expect(store.shuffledCharacters.length).toBeGreaterThan(0)
      expect(store.shuffledCharacters).toContain('测')
      expect(store.shuffledCharacters).toContain('试')
    })

    it('should combine custom characters with built-in sets', () => {
      const store = useHanziStore()
      const customChars = '自定义'
      const initialLength = store.shuffledCharacters.length

      // Add custom characters
      store.toggleCharacterSet('custom')
      store.updateCustomCharacterSet(customChars)

      expect(store.shuffledCharacters.length).toBeGreaterThan(initialLength)
    })

    it('should not include custom characters when not enabled', () => {
      const store = useHanziStore()
      const customChars = '魑魅魍魉'

      // Disable all built-in sets to isolate the test
      store.enabledSetIds = []
      
      store.updateCustomCharacterSet(customChars)
      // Don't enable custom set
      store.loadCharacters()
      
      const chars = store.shuffledCharacters
      expect(chars.length).toBe(0)
    })

    it('should handle empty custom character set gracefully', () => {
      const store = useHanziStore()
      const initialLength = store.shuffledCharacters.length

      store.toggleCharacterSet('custom')
      store.updateCustomCharacterSet('')

      // Should not affect character count (empty string adds no characters)
      expect(store.shuffledCharacters.length).toBe(initialLength)
    })

    it('should handle whitespace-only custom character set', () => {
      const store = useHanziStore()
      const initialLength = store.shuffledCharacters.length

      store.toggleCharacterSet('custom')
      store.updateCustomCharacterSet('   ')

      // Should not add any characters
      expect(store.shuffledCharacters.length).toBe(initialLength)
    })

    it('should persist custom character set state', () => {
      const store = useHanziStore()

      store.customCharacterSet = '持久化测试'
      store.toggleCharacterSet('custom')

      expect(store.$state.customCharacterSet).toBe('持久化测试')
      expect(store.$state.enabledSetIds).toContain('custom')
    })

    it('should reload characters when custom set content changes', () => {
      const store = useHanziStore()
      
      store.toggleCharacterSet('custom')
      store.updateCustomCharacterSet('初始')
      const lengthBeforeUpdate = store.shuffledCharacters.length

      store.updateCustomCharacterSet('初始更多字符')
      expect(store.shuffledCharacters.length).toBeGreaterThan(lengthBeforeUpdate)
    })

    it('should include custom set in toggleAllSets', () => {
      const store = useHanziStore()
      
      // Disable custom set first
      if (store.enabledSetIds.includes('custom')) {
        store.toggleCharacterSet('custom')
      }

      // Toggle all should enable custom set too
      store.toggleAllSets()
      expect(store.enabledSetIds).toContain('custom')
    })
  })
})
