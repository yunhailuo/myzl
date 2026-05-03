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
      <!-- Navigation Options -->
      <div class="config-item">
        <label class="config-label">
          <input 
            v-model="store.enableArrows" 
            type="checkbox"
            data-testid="toggle-arrows"
          />
          <span>显示导航箭头</span>
        </label>
      </div>
      <div class="config-item">
        <label class="config-label">
          <input 
            v-model="store.enableNavigation" 
            type="checkbox"
            data-testid="toggle-navigation"
          />
          <span>启用键盘/滑动手势</span>
        </label>
      </div>

      <!-- Sum Range -->
      <div class="config-item">
        <label class="config-label">
          <span>总和范围</span>
        </label>
        <div class="range-inputs">
          <input
            v-model.number="store.sumMin"
            type="number"
            min="-200"
            max="200"
            placeholder="2"
            class="number-input range-field"
          />
          <span class="range-separator">-</span>
          <input
            v-model.number="store.sumMax"
            type="number"
            min="-200"
            max="200"
            placeholder="20"
            class="number-input range-field"
          />
        </div>
      </div>

      <!-- Part Range -->
      <div class="config-item">
        <label class="config-label">
          <span>部分范围</span>
        </label>
        <div class="range-inputs">
          <input
            v-model.number="store.partMin"
            type="number"
            min="-100"
            max="100"
            placeholder="1"
            class="number-input range-field"
          />
          <span class="range-separator">-</span>
          <input
            v-model.number="store.partMax"
            type="number"
            min="-100"
            max="100"
            placeholder="10"
            class="number-input range-field"
          />
        </div>
      </div>

      <!-- Operators -->
      <div class="config-item config-row">
        <label class="config-label config-inline">
          <input 
            v-model="store.enableAddition" 
            type="checkbox" 
            @change="store.validateOperators"
          />
          <span>+</span>
        </label>
        <label class="config-label config-inline">
          <input 
            v-model="store.enableSubtraction" 
            type="checkbox" 
            @change="store.validateOperators"
          />
          <span>−</span>
        </label>
      </div>

      <!-- Decimal Places -->
      <div class="config-item">
        <label class="config-label">
          <span>小数位数</span>
          <input
            v-model.number="store.decimalPlaces"
            type="number"
            min="0"
            max="3"
            step="1"
            class="number-input"
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

.config-row {
  display: flex;
  gap: 1.5rem;
}

.config-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  gap: 0.5rem;
}

.config-inline {
  flex: 1;
}

.config-inline span {
  font-weight: 600;
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
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

/* Range input layout */
.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.range-field {
  width: 80px;
  text-align: center;
  margin-left: 0;
}

.range-separator {
  color: #999;
  font-weight: 500;
  user-select: none;
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
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  /* Optimize for different screen sizes */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  text-align: center;
  line-height: 1.1;
}
</style>