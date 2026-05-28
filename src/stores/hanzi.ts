import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import charactersData from '../data/characters.json'
import { shuffleArray } from '../utils/math'

interface CharacterSet {
  id: string
  name: string
  enabled: boolean
  data: string
}

interface CharactersJson {
  characterSets: CharacterSet[]
}

// Custom character set ID constant
const CUSTOM_SET_ID = 'custom'

export const useHanziStore = defineStore(
  'hanzi',
  () => {
    // ========== State ==========

    /** Enabled character set IDs (includes 'custom' if custom set is enabled) */
    const enabledSetIds = ref<string[]>([])
    /** Custom character set content (user-defined characters) */
    const customCharacterSet = ref('')
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

    /** Available character sets (includes custom set) */
    const availableSets = computed(() => {
      try {
        const builtInSets = (charactersData as CharactersJson).characterSets
        
        // Add custom set to the list
        return [
          ...builtInSets,
          {
            id: CUSTOM_SET_ID,
            name: '✏️ 自定义字库',
            enabled: false,
            data: customCharacterSet.value,
          },
        ]
      } catch (error) {
        console.error('Failed to load character sets:', error)
        return []
      }
    })

    /** Current character */
    const currentCharacter = computed(() => shuffledCharacters.value[currentIndex.value] || '')

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
     * Load and shuffle characters from all enabled sets
     * Resets progress to first character
     */
    function loadCharacters() {
      try {
        const allChars = availableSets.value
          .filter((set: CharacterSet) => enabledSetIds.value.includes(set.id))
          .flatMap((set: CharacterSet) => set.data.split('').filter(char => char.trim() !== ''))

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
        const isAllEnabled = allIds.every((id) => enabledSetIds.value.includes(id))
        enabledSetIds.value = isAllEnabled ? [] : [...allIds]
        loadCharacters()
      } catch (error) {
        console.error('Failed to toggle all sets:', error)
      }
    }

    /** Update custom character set content and reload characters if enabled */
    function updateCustomCharacterSet(characters: string) {
      try {
        customCharacterSet.value = characters
        // If custom set is enabled, reload characters to reflect the change
        if (enabledSetIds.value.includes(CUSTOM_SET_ID)) {
          loadCharacters()
        }
      } catch (error) {
        console.error('Failed to update custom character set:', error)
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
      customCharacterSet,
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
      updateCustomCharacterSet,
      nextCharacter,
      previousCharacter,
      resetToFirst,
    }
  },
  {
    persist: true,
  },
)
