<script setup lang="ts">
import { useAdditionSubtractionStore } from '../stores/additionSubtraction'
import { useGameNavigation } from '../composables/useGameNavigation'
import GameLayout from '../components/GameLayout.vue'
import '../assets/game-layout.css'

const store = useAdditionSubtractionStore()

useGameNavigation(
  () => store.nextProblem(),
  () => store.previousProblem(),
  () => store.enableNavigation,
)
</script>

<template>
  <GameLayout
    :counter-text="`第 ${store.count} 题`"
    :show-arrows="store.enableArrows"
    :disable-left-arrow="store.currentIndex === 0"
    @next="store.nextProblem"
    @prev="store.previousProblem"
  >
    <template #settings>
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
    </template>

    <div class="question-card">
      <div class="expression">{{ store.currentProblem }}</div>
    </div>
  </GameLayout>
</template>

<style scoped>
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

.expression {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  margin: 0;
  text-align: center;
  line-height: 1.1;
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
</style>
