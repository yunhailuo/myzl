import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import charactersData from '../data/characters.json'

interface CharacterSet {
  id: string
  name: string
  enabled: boolean
  data: string
}

/** Fisher-Yates shuffle algorithm */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp!
  }
  return shuffled
}

export const useHanziStore = defineStore('hanzi', () => {
  // ========== State ==========
  
  /** Enabled character set IDs */
  const enabledSetIds = ref<string[]>([])
  /** Shuffled character array */
  const shuffledCharacters = ref<string[]>([])
  /** Current character index */
  const currentIndex = ref(0)
  
  /** Show navigation arrows */
  const enableArrows = ref(true)
  /** Enable keyboard and swipe navigation */
  const enableNavigation = ref(true)
  /** Show pinyin */
  const showPinyin = ref(true)
  /** Show word examples */
  const showWords = ref(true)
  /** Loop stroke animation */
  const loopAnimation = ref(true)

  // ========== Getters ==========
  
  /** Available character sets */
  const availableSets = computed(() => {
    try {
      return (charactersData as any).characterSets as CharacterSet[]
    } catch (error) {
      console.error('Failed to load character sets:', error)
      return []
    }
  })
  
  /** Current character */
  const currentCharacter = computed(() => 
    shuffledCharacters.value[currentIndex.value] || ''
  )
  
  // ========== Actions ==========
  
  /**
   * Initialize enabled character sets (called only on first load)
   * Uses default configuration from data file if no saved state
   */
  function initEnabledSets() {
    try {
      if (enabledSetIds.value.length === 0) {
        enabledSetIds.value = availableSets.value
          .filter((set: CharacterSet) => set.enabled)
          .map((set: CharacterSet) => set.id)
      }
    } catch (error) {
      console.error('Failed to initialize enabled sets:', error)
      enabledSetIds.value = []
    }
  }

  /**
   * Load and shuffle characters
   * Resets progress to first character
   */
  function loadCharacters() {
    try {
      const allChars = availableSets.value
        .filter((set: CharacterSet) => enabledSetIds.value.includes(set.id))
        .flatMap((set: CharacterSet) => set.data.split(''))
      
      shuffledCharacters.value = shuffleArray(allChars)
      currentIndex.value = 0
    } catch (error) {
      console.error('Failed to load characters:', error)
      shuffledCharacters.value = []
      currentIndex.value = 0
    }
  }

  /** Reshuffle characters and reset progress */
  function reshuffleCharacters() {
    loadCharacters()
  }

  /** Toggle single character set */
  function toggleCharacterSet(setId: string) {
    try {
      const index = enabledSetIds.value.indexOf(setId)
      if (index > -1) {
        enabledSetIds.value.splice(index, 1)
      } else {
        enabledSetIds.value.push(setId)
      }
      loadCharacters()
    } catch (error) {
      console.error('Failed to toggle character set:', error)
    }
  }

  /** Toggle all character sets */
  function toggleAllSets() {
    try {
      const allIds = availableSets.value.map((set: CharacterSet) => set.id)
      const isAllEnabled = allIds.every(id => enabledSetIds.value.includes(id))
      enabledSetIds.value = isAllEnabled ? [] : [...allIds]
      loadCharacters()
    } catch (error) {
      console.error('Failed to toggle all sets:', error)
    }
  }

  /** Go to next character */
  function nextCharacter() {
    if (currentIndex.value < shuffledCharacters.value.length - 1) {
      currentIndex.value++
    }
  }

  /** Go to previous character */
  function previousCharacter() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /** Reset to first character */
  function resetToFirst() {
    currentIndex.value = 0
  }

  // ========== Initialization ==========
  initEnabledSets()
  if (shuffledCharacters.value.length === 0) {
    loadCharacters()
  }

  return {
    // State
    enabledSetIds,
    shuffledCharacters,
    currentIndex,
    enableArrows,
    enableNavigation,
    showPinyin,
    showWords,
    loopAnimation,
    
    // Getters
    availableSets,
    currentCharacter,
    
    // Actions
    loadCharacters,
    reshuffleCharacters,
    toggleCharacterSet,
    toggleAllSets,
    nextCharacter,
    previousCharacter,
    resetToFirst,
  }
}, {
  persist: true,
})
