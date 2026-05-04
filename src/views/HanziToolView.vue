<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import HanziWriter from 'hanzi-writer'
import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import 'cnchar-poly'
import 'cnchar-words'

// Word display constants
const WORD_LENGTH_MIN = 2
const WORD_LENGTH_MAX = 3
const WORD_DISPLAY_COUNT = 5

// Input state
const inputChar = ref('')
const writerRef = ref<HanziWriter | null>(null)
const containerId = 'hanzi-tool-container'

// Validation: ensure single Chinese character
const isValidChar = computed(() => {
  if (!inputChar.value || inputChar.value.length !== 1) return false
  // Check if it's a Chinese character (Unicode range for CJK Unified Ideographs)
  const code = inputChar.value.charCodeAt(0)
  return code >= 0x4e00 && code <= 0x9fff
})

// Get all pinyin readings for the character
const allPinyins = computed(() => {
  if (!isValidChar.value) return []
  
  // pinyin-pro returns multiple readings separated by spaces when there are multiple pronunciations
  const result = pinyin(inputChar.value, { 
    toneType: 'symbol',
    multiple: true 
  })
  
  // Split by space and remove duplicates
  return [...new Set(result.split(' '))]
})

// Get example words
const wordGroups = computed(() => {
  if (!isValidChar.value) return []

  const words = cnchar.words(inputChar.value, 'array') as string[]
  return words
    .filter((word) => word.length >= WORD_LENGTH_MIN && word.length <= WORD_LENGTH_MAX)
    .slice(0, WORD_DISPLAY_COUNT)
    .map((word) => ({
      word,
      chars: word.split('').map((char) => ({
        char,
        pinyin: char === inputChar.value ? '' : pinyin(char, { toneType: 'symbol' }),
        isCurrent: char === inputChar.value,
      })),
    }))
})

// Initialize or update Hanzi Writer
const initWriter = (char: string) => {
  // Ensure DOM element exists
  const container = document.getElementById(containerId)
  if (!container) return

  // Always destroy existing instance to avoid state issues
  if (writerRef.value) {
    writerRef.value = null
    container.innerHTML = ''
  }

  // Create fresh instance for each character
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
  
  writerRef.value.loopCharacterAnimation()
}

// Watch for input changes
watch(inputChar, async (newChar) => {
  if (isValidChar.value && newChar) {
    // Wait for DOM to update before initializing writer
    await nextTick()
    initWriter(newChar)
  }
})

// Clear input
const clearInput = () => {
  inputChar.value = ''
  if (writerRef.value) {
    // Destroy the writer instance
    writerRef.value = null
    const container = document.getElementById(containerId)
    if (container) {
      container.innerHTML = ''
    }
  }
}

// Validate and normalize input (called on blur/enter)
const validateAndNormalizeInput = () => {
  if (!inputChar.value) return
  
  // Use Array.from to properly handle Unicode characters (including emoji)
  const chars = Array.from(inputChar.value)
  
  // Only keep the last character if multiple are entered
  if (chars.length > 1) {
    const lastChar = chars[chars.length - 1]
    if (lastChar) {
      inputChar.value = lastChar
    }
  }
}

</script>

<template>
  <div class="hanzi-tool">
    <h1>汉字查询</h1>
    
    <!-- Input section -->
    <div class="input-section">
      <input
        v-model="inputChar"
        @blur="validateAndNormalizeInput"
        @keyup.enter="validateAndNormalizeInput"
        type="text"
        placeholder="输入一个汉字"
        class="char-input"
        aria-label="输入要查询的汉字"
      />
      <button 
        v-if="inputChar" 
        @click="clearInput" 
        class="clear-btn"
        aria-label="清空输入"
        title="清空"
      >
        ✕
      </button>
    </div>

    <!-- Results section -->
    <div v-if="isValidChar" class="results">
      <!-- Pinyin section -->
      <div class="pinyin-section">
        <h3>拼音</h3>
        <div class="pinyin-list">
          <span v-for="(py, index) in allPinyins" :key="index" class="pinyin-item">
            {{ py }}
          </span>
        </div>
      </div>

      <!-- Stroke order animation -->
      <div class="stroke-section">
        <h3>笔顺</h3>
        <div :id="containerId" class="writer-container"></div>
      </div>

      <!-- Example words -->
      <div v-if="wordGroups.length > 0" class="words-section">
        <h3>例词</h3>
        <div class="words-list">
          <div v-for="(group, idx) in wordGroups" :key="idx" class="word-group">
            <div class="word-chars">
              <span 
                v-for="(charData, cIdx) in group.chars" 
                :key="cIdx" 
                class="word-char"
                :class="{ 'current-char': charData.isCurrent }"
              >
                {{ charData.char }}
              </span>
            </div>
            <div class="word-pinyin">
              <span 
                v-for="(charData, cIdx) in group.chars" 
                :key="cIdx" 
                class="pinyin-char"
              >
                {{ charData.pinyin || '·' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-words">
        <p>暂无例词</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="inputChar" class="error-state">
      <p>请输入有效的单个汉字</p>
    </div>

    <!-- Initial state -->
    <div v-else class="empty-state">
      <p>输入汉字查看拼音、笔顺和例词</p>
    </div>
  </div>
</template>

<style scoped>
.hanzi-tool {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

/* Input section */
.input-section {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 2rem;
}

.char-input {
  width: 100%;
  padding: 1rem;
  font-size: 2rem;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.char-input:focus {
  border-color: #3498db;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.clear-btn:hover {
  color: #333;
}

/* Results section */
.results {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h3 {
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 1rem;
  text-align: left;
}

/* Pinyin section */
.pinyin-section {
  width: 100%;
}

.pinyin-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.pinyin-item {
  font-size: 2rem;
  color: #3498db;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: #f0f8ff;
  border-radius: 6px;
}

/* Stroke order section */
.stroke-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.writer-container {
  width: 250px;
  height: 250px;
  margin: 0 auto;
}

/* Words section */
.words-section {
  width: 100%;
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.word-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.8rem;
  background: #f9f9f9;
  border-radius: 6px;
  min-width: 100px;
}

.word-chars {
  display: flex;
  gap: 0.3rem;
}

.word-char {
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
}

.word-char.current-char {
  color: #e74c3c;
  font-weight: 700;
}

.word-pinyin {
  display: flex;
  gap: 0.3rem;
}

.pinyin-char {
  font-size: 0.9rem;
  color: #666;
  min-width: 1.5rem;
  text-align: center;
}

/* Error and empty states */
.error-state,
.empty-state {
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  margin-top: 3rem;
}

.no-words {
  text-align: center;
  color: #999;
  font-size: 1rem;
  margin-top: 1rem;
}

/* Responsive design */
@media (max-width: 600px) {
  .hanzi-tool {
    padding: 1.5rem 0.8rem;
  }

  h1 {
    font-size: 1.6rem;
  }

  .char-input {
    font-size: 1.5rem;
    padding: 0.8rem;
  }

  .pinyin-item {
    font-size: 1.5rem;
  }

  .writer-container {
    width: 200px;
    height: 200px;
  }

  .word-char {
    font-size: 1.2rem;
  }

  .pinyin-char {
    font-size: 0.8rem;
  }
}
</style>
