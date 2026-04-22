<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import HanziWriter from 'hanzi-writer'
import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import 'cnchar-poly'
import 'cnchar-words'

const characters = ['我', '你', '他', '双', '壮', '床']

const index = ref(0)
const writerRef = ref<HanziWriter | null>(null)
const containerId = 'hanzi-container'
const showConfig = ref(false)
const enableArrows = ref(true)
const enableNavigation = ref(true)
const configOpen = ref(false)
const showPinyin = ref(true)
const loopAnimation = ref(true)
const hidePinyin = ref(true) // 默认遮盖拼音
const hideWords = ref(true) // 默认遮盖组词

const currentCharacter = computed(() => characters[index.value])
const currentPinyin = computed(() => {
  if (currentCharacter.value) {
    return pinyin(currentCharacter.value, { toneType: 'symbol' })
  }
  return ''
})

// 获取组词 - 使用 cnchar.words API
const wordGroups = computed(() => {
  if (!currentCharacter.value) return []

  // 使用 cnchar.words 获取包含当前汉字的词语
  const words = cnchar.words(currentCharacter.value, 'array') as string[]

  // 过滤出2-3个字的词语,最多取3个
  const filteredWords = words.filter((word) => word.length >= 2 && word.length <= 3).slice(0, 3)

  // 为每个词语生成带拼音的数据
  return filteredWords.map((word) => {
    const chars = word.split('')
    return {
      word,
      chars: chars.map((char) => ({
        char,
        pinyin: char === currentCharacter.value ? '' : pinyin(char, { toneType: 'symbol' }),
        isCurrent: char === currentCharacter.value,
      })),
    }
  })
})

const count = computed(() => index.value + 1)

const initWriter = (char: string) => {
  if (!writerRef.value) {
    // 首次创建实例
    writerRef.value = HanziWriter.create(containerId, char, {
      width: 250,
      height: 250,
      renderer: 'canvas', // 使用 canvas 渲染器,性能更好
      showOutline: true, // 显示汉字轮廓
      strokeColor: '#e74c3c', // 笔画颜色
      outlineColor: '#bdc3c7', // 轮廓颜色
      strokeAnimationSpeed: 1.5, // 笔画动画速度
      delayBetweenStrokes: 400, // 笔画间延迟(毫秒)
      delayBetweenLoops: 1000, // 循环间隔(毫秒)
      padding: 10, // 内边距
    })
  } else {
    // 重用实例,切换汉字
    writerRef.value.setCharacter(char)
  }

  // 自动播放动画,根据配置决定是否循环
  if (loopAnimation.value) {
    writerRef.value.loopCharacterAnimation()
  } else {
    writerRef.value.animateCharacter()
  }
}

const nextCharacter = () => {
  if (index.value < characters.length - 1) {
    index.value++
    initWriter(characters[index.value]!)
  }
}

const previousCharacter = () => {
  if (index.value > 0) {
    index.value--
    initWriter(characters[index.value]!)
  }
}

const toggleConfig = () => {
  showConfig.value = !showConfig.value
  if (showConfig.value) {
    configOpen.value = true
  } else {
    configOpen.value = false
  }
}

const handleSwipe = (direction: 'left' | 'right') => {
  if (!enableNavigation.value) return
  if (direction === 'left') {
    nextCharacter()
  } else {
    previousCharacter()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!enableNavigation.value) return
  if (e.key === 'ArrowRight') {
    nextCharacter()
  }
  if (e.key === 'ArrowLeft') {
    previousCharacter()
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
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    handleSwipe(diffX > 0 ? 'left' : 'right')
  }
  startX = 0
  startY = 0
}

onMounted(() => {
  // 初始化第一个字
  initWriter(characters[0]!)

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

// 监听循环动画设置变化
watch(loopAnimation, (newVal) => {
  if (writerRef.value && currentCharacter.value) {
    writerRef.value.setCharacter(currentCharacter.value)
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
      <button class="config-btn" @click="toggleConfig" aria-label="Settings">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
          />
        </svg>
      </button>
    </div>

    <div :class="['config-panel', { open: showConfig }]">
      <div class="config-header">
        <span class="config-title">设置</span>
        <button class="close-btn" @click="toggleConfig" aria-label="Close">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="enableArrows" type="checkbox" data-testid="toggle-arrows" />
          <span>显示左右箭头按钮</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="enableNavigation" type="checkbox" data-testid="toggle-navigation" />
          <span>启用键盘和滑动操作</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="showPinyin" type="checkbox" data-testid="toggle-pinyin" />
          <span>显示拼音</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="loopAnimation" type="checkbox" data-testid="toggle-loop" />
          <span>循环播放动画</span>
        </label>
      </div>
    </div>

    <div :class="['config-overlay', { active: configOpen }]" @click="toggleConfig"></div>

    <button
      v-if="enableArrows"
      class="nav-bar left"
      @click="previousCharacter"
      :disabled="index === 0"
      aria-label="Previous character"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <div :class="['question-area', { 'arrows-disabled': !enableArrows }]">
      <div class="question-card">
        <div class="content-wrapper">
          <div
            v-if="showPinyin && currentPinyin"
            class="pinyin-container"
            @click="hidePinyin = !hidePinyin"
          >
            <span :class="['pinyin-display', { hidden: hidePinyin }]">{{ currentPinyin }}</span>
            <div v-if="hidePinyin" class="pinyin-mask">🙈</div>
          </div>
          <div :id="containerId"></div>

          <!-- 组词显示区域 -->
          <div
            v-if="wordGroups.length > 0"
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
      v-if="enableArrows"
      class="nav-bar right"
      @click="nextCharacter"
      :disabled="index === characters.length - 1"
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
  z-index: 10;
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
  z-index: 9;
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
  z-index: 10;
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
  z-index: 11;
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
  z-index: 12;
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
  z-index: 12;
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
