<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import HanziWriter from 'hanzi-writer'
import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import 'cnchar-poly'
import 'cnchar-words'
import { useHanziStore } from '../stores/hanzi'
import { useGameNavigation } from '../composables/useGameNavigation'
import GameLayout from '../components/GameLayout.vue'
import '../assets/game-layout.css'

// Word display constants
const WORD_LENGTH_MIN = 2
const WORD_LENGTH_MAX = 3
const WORD_DISPLAY_COUNT = 3

const store = useHanziStore()
const writerRef = ref<HanziWriter | null>(null)
const containerId = 'hanzi-container'

// Character set selection collapsed state (default collapsed)
const charSetsExpanded = ref(false)

// Local mask state (reset on page flip)
const hidePinyin = ref(true)
const hideWords = ref(true)

// Reset masks on page change
watch(
  () => store.currentIndex,
  () => {
    hidePinyin.value = true
    hideWords.value = true
  },
)

// Computed properties
const currentPinyin = computed(() =>
  store.currentCharacter ? pinyin(store.currentCharacter, { toneType: 'symbol' }) : '',
)

const wordGroups = computed(() => {
  if (!store.currentCharacter) return []

  const words = cnchar.words(store.currentCharacter, 'array') as string[]
  return words
    .filter((word) => word.length >= WORD_LENGTH_MIN && word.length <= WORD_LENGTH_MAX)
    .slice(0, WORD_DISPLAY_COUNT)
    .map((word) => ({
      word,
      chars: word.split('').map((char) => ({
        char,
        pinyin: char === store.currentCharacter ? '' : pinyin(char, { toneType: 'symbol' }),
        isCurrent: char === store.currentCharacter,
      })),
    }))
})

const count = computed(() => store.currentIndex + 1)

// Initialize Hanzi Writer
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

// Navigation functions
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

useGameNavigation(goToNext, goToPrevious, () => store.enableNavigation)

// Reshuffle characters and reset to first
const handleReshuffle = () => {
  store.reshuffleCharacters()

  // Reinitialize animation for current character
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }

  // Reset masks
  hidePinyin.value = true
  hideWords.value = true
}

onMounted(() => {
  if (store.currentCharacter) {
    initWriter(store.currentCharacter)
  }
})

// Watch loop animation setting changes
watch(
  () => store.loopAnimation,
  (newVal) => {
    if (writerRef.value && store.currentCharacter) {
      writerRef.value.setCharacter(store.currentCharacter)
      if (newVal) {
        writerRef.value.loopCharacterAnimation()
      } else {
        writerRef.value.animateCharacter()
      }
    }
  },
)
</script>

<template>
  <GameLayout
    :counter-text="`第 ${count} 个`"
    :show-arrows="store.enableArrows"
    :disable-left-arrow="store.currentIndex === 0"
    :disable-right-arrow="store.currentIndex === store.shuffledCharacters.length - 1"
    @next="goToNext"
    @prev="goToPrevious"
  >
    <template #header-actions>
      <button
        class="reshuffle-btn"
        @click="handleReshuffle"
        aria-label="Reshuffle characters"
        title="重新打乱字库"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
          />
        </svg>
      </button>
    </template>

    <template #settings>
      <!-- Character set selection (default collapsed) -->
      <div class="config-section">
        <div class="section-header collapsible" @click="charSetsExpanded = !charSetsExpanded">
          <h4 class="section-title">📚 字库选择</h4>
          <span class="collapse-icon">{{ charSetsExpanded ? '▲' : '▼' }}</span>
        </div>
        <div v-show="charSetsExpanded" class="set-list">
          <div class="header-actions">
            <button class="select-all-btn" @click.stop="store.toggleAllSets">
              {{
                store.availableSets.every((set) => store.enabledSetIds.includes(set.id))
                  ? '取消全选'
                  : '全选'
              }}
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

      <!-- Other settings -->
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
    </template>

    <div class="question-card hanzi-card">
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

        <!-- Word display area -->
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
  </GameLayout>
</template>

<!-- Style section -->
<style scoped>
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

.reshuffle-btn {
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

.reshuffle-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.reshuffle-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
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

.hanzi-card {
  padding: 2rem 1.5rem;
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
  background: linear-gradient(135deg, #b3e5fc 0%, #c8e6f9 100%);
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
  background: linear-gradient(135deg, #c8e6f9 0%, #b3e5fc 100%);
  transform: scale(1.05);
}

.pinyin-display.hidden {
  opacity: 0;
}

.word-groups-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 50px; /* Ensure placeholder or click area even when hidden */
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
  background: linear-gradient(135deg, #b3e5fc 0%, #c8e6f9 100%);
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
  background: linear-gradient(135deg, #c8e6f9 0%, #b3e5fc 100%);
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
</style>
