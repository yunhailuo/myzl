<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import HanziWriter from 'hanzi-writer'
import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import 'cnchar-poly'
import 'cnchar-words'
import { useHanziStore } from '../stores/hanzi'

// 组词配置常量
const WORD_LENGTH_MIN = 2
const WORD_LENGTH_MAX = 3
const WORD_DISPLAY_COUNT = 3

const store = useHanziStore()
const writerRef = ref<HanziWriter | null>(null)
const containerId = 'hanzi-container'
const showConfig = ref(false)

// 字库选择折叠状态(默认折叠)
const charSetsExpanded = ref(false)

// 本地遮罩状态(翻页时自动重置)
const hidePinyin = ref(true)
const hideWords = ref(true)

// 监听翻页,重置遮罩
watch(() => store.currentIndex, () => {
  hidePinyin.value = true
  hideWords.value = true
})

// 计算属性
const currentPinyin = computed(() => 
  store.currentCharacter ? pinyin(store.currentCharacter, { toneType: 'symbol' }) : ''
)

const wordGroups = computed(() => {
  if (!store.currentCharacter) return []

  const words = cnchar.words(store.currentCharacter, 'array') as string[]
  return words
    .filter(word => word.length >= WORD_LENGTH_MIN && word.length <= WORD_LENGTH_MAX)
    .slice(0, WORD_DISPLAY_COUNT)
    .map(word => ({
      word,
      chars: word.split('').map(char => ({
        char,
        pinyin: char === store.currentCharacter ? '' : pinyin(char, { toneType: 'symbol' }),
        isCurrent: char === store.currentCharacter,
      })),
    }))
})

const count = computed(() => store.currentIndex + 1)

// Hanzi Writer 初始化
const initWriter = (char: string) => {
  if (!writerRef.value) {
    writerRef.value = HanziWriter.create(containerId, char, {
      width: 250,
      height: 250,
      renderer: 'canvas',
      showOutline: true,
      strokeColor: '#e74c3c',
      outlineColor: '#bdc3c7',
      strokeAnimationSpeed: 1.5,
      delayBetweenStrokes: 400,
      delayBetweenLoops: 1000,
      padding: 10,
    })
  } else {
    writerRef.value.setCharacter(char)
  }

  if (store.loopAnimation) {
    writerRef.value.loopCharacterAnimation()
  } else {
    writerRef.value.animateCharacter()
  }
}

// 导航函数
const goToNext = () => {
  store.nextCharacter()
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }
}

const goToPrevious = () => {
  store.previousCharacter()
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }
}

const toggleConfig = () => {
  showConfig.value = !showConfig.value
}

// 重新打乱字库并重置到第一个字
const handleReshuffle = () => {
  store.reshuffleCharacters()
  
  // 重新初始化当前字符的动画
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }
  
  // 重置遮罩
  hidePinyin.value = true
  hideWords.value = true
}

// 手势和键盘事件
const handleSwipe = (direction: 'left' | 'right') => {
  if (!store.enableNavigation) return
  
  if (direction === 'left') {
    goToNext()
  } else {
    goToPrevious()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!store.enableNavigation) return
  
  if (e.key === 'ArrowRight') {
    goToNext()
  }
  if (e.key === 'ArrowLeft') {
    goToPrevious()
  }
}

let startX = 0
let startY = 0

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    startX = e.touches[0]!.clientX
    startY = e.touches[0]!.clientY
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!startX || !startY || e.changedTouches.length === 0) return
  
  const endX = e.changedTouches[0]!.clientX
  const endY = e.changedTouches[0]!.clientY
  const diffX = startX - endX
  const diffY = startY - endY
  
  // 水平滑动距离大于垂直滑动且超过阈值
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    handleSwipe(diffX > 0 ? 'left' : 'right')
  }
  
  startX = 0
  startY = 0
}

onMounted(() => {
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }
  
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

// 监听循环动画设置变化
watch(() => store.loopAnimation, (newVal) => {
  if (writerRef.value && store.currentCharacter) {
    writerRef.value.setCharacter(store.currentCharacter)
    if (newVal) {
      writerRef.value.loopCharacterAnimation()
    } else {
      writerRef.value.animateCharacter()
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="game">
    <div class="header">
      <div class="counter">第 {{ count }} 个</div>
      <div class="header-actions">
        <button class="config-btn" @click="handleReshuffle" aria-label="Reshuffle characters" title="重新打乱字库">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
        <button class="config-btn" @click="toggleConfig" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div :class="['config-panel', { open: showConfig }]">
      <button class="close-btn" @click="toggleConfig" aria-label="Close settings">✕</button>
      
      <!-- 字库选择(默认折叠) -->
      <div class="config-section">
        <div class="section-header collapsible" @click="charSetsExpanded = !charSetsExpanded">
          <h4 class="section-title">📚 字库选择</h4>
          <span class="collapse-icon">{{ charSetsExpanded ? '▲' : '▼' }}</span>
        </div>
        <div v-show="charSetsExpanded" class="set-list">
          <div class="header-actions">
            <button class="select-all-btn" @click.stop="store.toggleAllSets">
              {{ store.availableSets.every((set) => store.enabledSetIds.includes(set.id)) ? '取消全选' : '全选' }}
            </button>
          </div>
          <div v-for="set in store.availableSets" :key="set.id" class="set-item">
            <label class="config-label">
              <input 
                type="checkbox" 
                :checked="store.enabledSetIds.includes(set.id)"
                @change="() => store.toggleCharacterSet(set.id)"
              />
              <span>{{ set.name }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 其他设置项 -->
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.enableArrows" type="checkbox" data-testid="toggle-arrows" />
          <span>显示左右箭头按钮</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.enableNavigation" type="checkbox" data-testid="toggle-navigation" />
          <span>启用键盘和滑动操作</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.showPinyin" type="checkbox" data-testid="toggle-pinyin" />
          <span>显示拼音</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.showWords" type="checkbox" data-testid="toggle-words" />
          <span>显示词语</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.loopAnimation" type="checkbox" data-testid="toggle-loop" />
          <span>循环播放动画</span>
        </label>
      </div>
    </div>

    <div :class="['config-overlay', { active: showConfig }]" @click="toggleConfig"></div>

    <button
      v-if="store.enableArrows"
      class="nav-bar left"
      @click="goToPrevious"
      :disabled="store.currentIndex === 0"
      aria-label="Previous character"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <div :class="['question-area', { 'arrows-disabled': !store.enableArrows }]">
      <div class="question-card">
        <div class="content-wrapper">
          <div
            v-if="store.showPinyin && currentPinyin"
            class="pinyin-container"
            @click="hidePinyin = !hidePinyin"
          >
            <span :class="['pinyin-display', { hidden: hidePinyin }]">{{ currentPinyin }}</span>
            <div v-if="hidePinyin" class="pinyin-mask">🙈</div>
          </div>
          <div :id="containerId"></div>

          <!-- 组词显示区域 -->
          <div
            v-if="store.showWords && wordGroups.length > 0"
            class="word-groups-container"
            @click="hideWords = !hideWords"
          >
            <div class="word-groups-mask" v-if="hideWords">🙈</div>
            <div :class="['word-groups', { hidden: hideWords }]">
              <div v-for="(group, idx) in wordGroups" :key="idx" class="word-item">
                <span
                  v-for="(charData, charIdx) in group.chars"
                  :key="charIdx"
                  class="char-with-pinyin"
                >
                  <span class="char-pinyin" v-if="charData.pinyin">{{ charData.pinyin }}</span>
                  <span class="char-text">{{ charData.char }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="store.enableArrows"
      class="nav-bar right"
      @click="goToNext"
      :disabled="store.currentIndex === store.shuffledCharacters.length - 1"
      aria-label="Next character"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </button>
  </div>
</template>

<!-- 样式部分 -->
<style scoped>
.game {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100vw;
}

.header {
  grid-column: 1 / -1;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.counter {
  flex: 1;
  text-align: center;
  font-weight: bold;
  color: #000;
  font-size: 1.3rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.config-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  color: #333;
  flex-shrink: 0;
}

.config-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.config-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.config-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid #ddd;
  padding: 1rem;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.config-panel.open {
  transform: translateX(0);
}

.config-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.config-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.config-panel h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.config-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.config-item {
  margin: 0.75rem 0;
}

.config-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  gap: 0.5rem;
}

.config-label input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.config-section {
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-header.collapsible {
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem 0.5rem -0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  user-select: none;
}

.section-header.collapsible:hover {
  background-color: #f5f5f5;
}

.section-title {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
  margin: 0;
}

.collapse-icon {
  font-size: 0.8rem;
  color: #999;
  transition: transform 0.2s ease;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.reshuffle-btn {
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #555;
}

.reshuffle-btn:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

.select-all-btn {
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #555;
}

.select-all-btn:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

.set-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.set-list .header-actions {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.set-item {
  padding: 0.25rem 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.question-area {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: 0;
  transition: grid-column 0.2s ease;
}

.question-area.arrows-disabled {
  grid-column: 1 / -1;
}

.question-card {
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: 2rem 1.5rem;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0;
  flex: 1;
}

.content-wrapper > * {
  flex-shrink: 0;
}

.pinyin-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  min-width: 200px;
  z-index: 1;
}

.pinyin-display {
  font-size: 2rem;
  font-weight: 600;
  color: #3498db;
  margin-bottom: 0.5rem;
  display: inline-block;
  min-width: 200px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.pinyin-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 200px;
  background: linear-gradient(135deg, #B3E5FC 0%, #C8E6F9 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  z-index: 3;
}

.pinyin-mask:hover {
  background: linear-gradient(135deg, #C8E6F9 0%, #B3E5FC 100%);
  transform: scale(1.05);
}

.pinyin-display.hidden {
  opacity: 0;
}

.word-groups-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 50px; /* 确保即使隐藏也有占位或点击区域 */
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.word-groups-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #B3E5FC 0%, #C8E6F9 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 3;
  transition: all 0.2s ease;
}

.word-groups-mask:hover {
  background: linear-gradient(135deg, #C8E6F9 0%, #B3E5FC 100%);
  transform: scale(1.02);
}

.word-groups {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  width: 100%;
  max-width: 600px;
  justify-content: center;
  flex-wrap: wrap;
  transition: opacity 0.2s ease;
}

.word-groups.hidden {
  opacity: 0;
}

.word-item {
  display: flex;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s ease;
  align-items: flex-end;
}

.word-item:hover {
  background: #e9ecef;
}

.char-with-pinyin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.char-pinyin {
  font-size: 0.9rem;
  color: #3498db;
  font-weight: 500;
  min-height: 1.2rem;
  visibility: hidden;
}

.char-pinyin:not(:empty) {
  visibility: visible;
}

.char-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1;
}

.nav-bar {
  border: none;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: background 0.2s ease;
  padding: 0;
  width: 48px;
  height: 100%;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.nav-bar svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.nav-bar:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
}

.nav-bar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-bar.left {
  grid-column: 1;
}

.nav-bar.right {
  grid-column: 3;
}

@media (max-width: 600px) {
  .game {
    grid-template-columns: 40px 1fr 40px;
  }

  .nav-bar {
    width: 40px;
  }

  .config-btn {
    width: 36px;
    height: 36px;
  }

  .pinyin-display {
    font-size: 1.5rem;
  }

  .pinyin-mask {
    font-size: 0.9rem;
  }

  .word-groups {
    max-width: 100%;
    gap: 0.6rem;
  }

  .word-item {
    padding: 0.6rem 0.8rem;
    gap: 0.4rem;
  }

  .char-pinyin {
    font-size: 0.8rem;
  }

  .char-text {
    font-size: 1.3rem;
  }
}

#hanzi-container {
  flex-shrink: 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
