<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useLinearEquationStore } from '../stores/linearEquation'

const store = useLinearEquationStore()
const showConfig = ref(false)
const configBtnRef = ref<HTMLButtonElement>()
const closeBtnRef = ref<HTMLButtonElement>()

const toggleConfig = async () => {
  showConfig.value = !showConfig.value
  if (showConfig.value) {
    await nextTick()
    closeBtnRef.value?.focus()
  } else {
    configBtnRef.value?.focus()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!store.enableNavigation || showConfig.value) return
  if (e.key === 'ArrowRight') store.nextProblem()
  else if (e.key === 'ArrowLeft') store.previousProblem()
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
  
  const diffX = startX - e.changedTouches[0]!.clientX
  const diffY = startY - e.changedTouches[0]!.clientY
  
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      store.nextProblem()
    } else {
      store.previousProblem()
    }
  }
  
  startX = startY = 0
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
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
      <div class="counter">第 {{ store.count }} 题</div>
      <button class="config-btn" ref="configBtnRef" @click="toggleConfig" aria-label="Settings">
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
        <button class="close-btn" ref="closeBtnRef" @click="toggleConfig" aria-label="Close">
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
          <span>最大项数</span>
          <input
            v-model.number="store.maxTerms"
            type="number"
            min="4"
            max="12"
            step="1"
            class="number-input"
            @change="store.updateMaxTerms(store.maxTerms)"
          />
        </label>
      </div>
    </div>

    <div :class="['config-overlay', { active: showConfig }]" @click="toggleConfig"></div>

    <button
      v-if="store.enableArrows"
      class="nav-btn left"
      @click="store.previousProblem"
      :disabled="store.currentIndex === 0"
      aria-label="Previous problem"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <div :class="['question-area', { 'full-width': !store.enableArrows }]">
      <div class="question-card">
        <div class="expression">{{ store.currentProblem }}</div>
      </div>
    </div>
    <button
      v-if="store.enableArrows"
      class="nav-btn right"
      @click="store.nextProblem"
      aria-label="Next problem"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </button>
  </div>
</template>

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

.config-label input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.number-input {
  width: 100px;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-left: auto;
}

.number-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
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

.question-card {
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: 2.5rem 2rem;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.expression {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin: 0;
  text-align: center;
  line-height: 1.2;
  color: #333;
}

.show-answer-btn {
  padding: 0.6rem 1.5rem;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.show-answer-btn:hover {
  background: #357abd;
}

.answer-section {
  width: 100%;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #4a90e2;
}

.answer {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.steps {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.nav-btn {
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

.nav-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn.left {
  grid-column: 1;
}

.nav-btn.right {
  grid-column: 3;
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

.question-area.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 600px) {
  .game {
    grid-template-columns: 40px 1fr 40px;
  }

  .nav-btn {
    width: 40px;
  }

  .config-btn {
    width: 36px;
    height: 36px;
  }

  .expression {
    font-size: clamp(2rem, 5vw, 3rem);
  }
}
</style>
