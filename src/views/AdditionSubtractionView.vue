<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Question {
  num1: number
  num2: number
  op: '+' | '-'
}

const count = ref(0)
const question = ref<Question>({ num1: 0, num2: 0, op: '+' })

const generateQuestion = (): Question => {
  const op = Math.random() < 0.5 ? '+' : '-'
  let num1 = Math.floor(Math.random() * 21) // 0-20
  let num2 = Math.floor(Math.random() * 21)
  if (op === '-') {
    // ensure num1 >= num2
    if (num1 < num2) {
      [num1, num2] = [num2, num1]
    }
  }
  return { num1, num2, op }
}

const nextQuestion = () => {
  question.value = generateQuestion()
  count.value++
}

const handleSwipe = (direction: 'left' | 'right') => {
  // For now, any swipe goes to next
  nextQuestion()
}

let startX = 0
let startY = 0

const handleTouchStart = (e: TouchEvent) => {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!startX || !startY) return
  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const diffX = startX - endX
  const diffY = startY - endY
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    // Horizontal swipe
    handleSwipe(diffX > 0 ? 'left' : 'right')
  }
  startX = 0
  startY = 0
}

onMounted(() => {
  nextQuestion()
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="game">
    <header>
      <RouterLink to="/" class="back-link">← Back to Menu</RouterLink>
      <div class="counter">Questions: {{ count }}</div>
    </header>
    <main class="question-area">
      <div class="question">
        {{ question.num1 }} {{ question.op }} {{ question.num2 }}
      </div>
      <button @click="nextQuestion" class="next-btn">Next</button>
    </main>
  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.back-link {
  text-decoration: none;
  color: #007bff;
}

.counter {
  font-weight: bold;
}

.question-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.question {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.next-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.next-btn:hover {
  background: #218838;
}

@media (max-width: 600px) {
  .question {
    font-size: 3rem;
  }
}
</style>