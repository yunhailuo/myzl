<script setup lang="ts">
import { useDistributiveLawStore } from '../stores/distributiveLaw'
import { useGameNavigation } from '../composables/useGameNavigation'
import GameLayout from '../components/GameLayout.vue'
import '../assets/game-layout.css'

const store = useDistributiveLawStore()

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
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.enableTrap" type="checkbox" @change="store.toggleTrap" />
          <span>包含陷阱题</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input v-model="store.enableSwap" type="checkbox" @change="store.toggleSwap" />
          <span>包含干扰项</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <span>数量级 (10^{{ store.maxPower }})</span>
          <input
            v-model.number="store.maxPower"
            type="number"
            min="2"
            max="4"
            step="1"
            class="number-input"
            @change="store.updateMaxPower(store.maxPower)"
          />
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <span>小数位数</span>
          <input
            v-model.number="store.decimalPlaces"
            type="number"
            min="0"
            max="2"
            step="1"
            class="number-input"
            @change="store.updateDecimalPlaces(store.decimalPlaces)"
          />
        </label>
      </div>
    </template>

    <div class="question-card">
      <div class="expression">{{ store.currentProblem }}</div>
    </div>
  </GameLayout>
</template>

<style scoped>
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
</style>
