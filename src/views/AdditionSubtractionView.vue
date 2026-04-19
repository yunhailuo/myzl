<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Question {
  num1: number
  num2: number
  op: '+' | '-'
}

const generateQuestion = (): Question => {
  const op = Math.random() < 0.5 ? '+' : '-'
  let num1 = Math.floor(Math.random() * 19) + 1
  let num2 = Math.floor(Math.random() * 19) + 1
  if (op === '-') {
    if (num1 < num2) {
      ;[num1, num2] = [num2, num1]
    }
  }
  return { num1, num2, op }
}

const history = ref<Question[]>([generateQuestion()])
const index = ref(0)

const currentQuestion = computed(() => history.value[index.value])
const count = computed(() => index.value + 1)

const nextQuestion = () => {
  if (index.value < history.value.length - 1) {
    index.value++
  } else {
    history.value.push(generateQuestion())
    index.value = history.value.length - 1
  }
}

const previousQuestion = () => {
  if (index.value > 0) {
    index.value--
  }
}

const handleSwipe = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    nextQuestion()
  } else {
    previousQuestion()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextQuestion()
  }
  if (e.key === 'ArrowLeft') {
    previousQuestion()
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
    <div class="counter">第 {{ count }} 题</div>
    <button
      class="nav-bar left"
      @click="previousQuestion"
      :disabled="index === 0"
      aria-label="Previous question"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <div class="question-area">
      <div class="question-card">
        <div class="question">
          {{ currentQuestion!.num1 }} {{ currentQuestion!.op }} {{ currentQuestion!.num2 }}
        </div>
      </div>
    </div>
    <button class="nav-bar right" @click="nextQuestion" aria-label="Next question">
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

.counter {
  grid-column: 1 / -1;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
  color: #000;
  font-size: 1.3rem;
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
  align-items: center;
  justify-content: center;
}

.question {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  margin: 0;
  text-align: center;
  line-height: 1.1;
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
}
</style>
