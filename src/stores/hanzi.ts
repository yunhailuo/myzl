import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import charactersData from '../data/characters.json'

interface CharacterSet {
  id: string
  name: string
  enabled: boolean
  data: string
}

/**
 * Fisher-Yates 洗牌算法
 * @param array 要打乱的数组
 * @returns 打乱后的新数组
 */
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
  
  /** 已启用的字库ID列表 */
  const enabledSetIds = ref<string[]>([])
  /** 打乱后的汉字数组 */
  const shuffledCharacters = ref<string[]>([])
  /** 当前学习位置索引 */
  const currentIndex = ref(0)
  
  /** 是否显示左右箭头按钮 */
  const enableArrows = ref(true)
  /** 是否启用键盘和滑动手势导航 */
  const enableNavigation = ref(true)
  /** 是否显示拼音 */
  const showPinyin = ref(true)
  /** 是否显示组词 */
  const showWords = ref(true)
  /** 是否循环播放笔顺动画 */
  const loopAnimation = ref(true)

  // ========== Getters ==========
  
  /** 所有可用的字库列表 */
  const availableSets = computed(() => charactersData.characterSets as CharacterSet[])
  
  /** 当前学习的汉字 */
  const currentCharacter = computed(() => 
    shuffledCharacters.value[currentIndex.value] || ''
  )
  
  // ========== Actions ==========
  
  /**
   * 初始化启用的字库(仅在首次加载时调用)
   * 如果没有保存的状态,使用数据文件中的默认配置
   */
  function initEnabledSets() {
    if (enabledSetIds.value.length === 0) {
      enabledSetIds.value = charactersData.characterSets
        .filter((set: CharacterSet) => set.enabled)
        .map((set: CharacterSet) => set.id)
    }
  }

  /**
   * 加载并打乱字库
   * 会重置当前进度到第一个字
   */
  function loadCharacters() {
    const allChars = availableSets.value
      .filter((set: CharacterSet) => enabledSetIds.value.includes(set.id))
      .flatMap((set: CharacterSet) => set.data.split(''))
    
    shuffledCharacters.value = shuffleArray(allChars)
    currentIndex.value = 0
  }

  /**
   * 重新随机打乱字库
   * 会自动重置进度到第一个字
   */
  function reshuffleCharacters() {
    loadCharacters()
  }

  /**
   * 切换单个字库的启用状态
   * @param setId 字库ID
   */
  function toggleCharacterSet(setId: string) {
    const index = enabledSetIds.value.indexOf(setId)
    if (index > -1) {
      enabledSetIds.value.splice(index, 1)
    } else {
      enabledSetIds.value.push(setId)
    }
    loadCharacters()
  }

  /**
   * 全选或取消全选所有字库
   */
  function toggleAllSets() {
    const allIds = availableSets.value.map((set: CharacterSet) => set.id)
    const isAllEnabled = allIds.every(id => enabledSetIds.value.includes(id))
    enabledSetIds.value = isAllEnabled ? [] : [...allIds]
    loadCharacters()
  }

  /** 跳转到下一个汉字 */
  function nextCharacter() {
    if (currentIndex.value < shuffledCharacters.value.length - 1) {
      currentIndex.value++
    }
  }

  /** 跳转到上一个汉字 */
  function previousCharacter() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /** 重置到第一个汉字 */
  function resetToFirst() {
    currentIndex.value = 0
  }

  // ========== 初始化 ==========
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
