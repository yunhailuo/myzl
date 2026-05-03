<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGameByName } from '../data/games'

const route = useRoute()
const router = useRouter()

// Extract game name from the path (e.g., /addition-subtraction/batch -> addition-subtraction)
const gameName = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  // Remove 'batch' from the end to get the game name
  return pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : ''
})

const count = computed(() => Math.max(1, Math.min(1000, Number(route.query.count) || 20)))
const columns = computed(() => Math.max(1, Math.min(6, Number(route.query.columns) || 3)))
const lineSpacing = computed(() => {
  const value = Number(route.query.lineSpacing)
  return Math.max(0, Math.min(20.0, isNaN(value) ? 1.5 : value))
})

// Calculate dynamic vertical spacing based on line spacing multiplier
const itemVerticalPadding = computed(() => (lineSpacing.value * 0.3).toFixed(2)) // Only vertical padding scales
const rowGap = computed(() => (lineSpacing.value * 0.4).toFixed(2)) // Gap scales with line spacing

const gameMeta = computed(() => getGameByName(gameName.value))

const questions = ref<string[]>([])
const isLoading = ref(true)

onMounted(async () => {
  if (!gameMeta.value) {
    router.push('/')
    return
  }

  // Get store loader from game configuration
  const loadStore = gameMeta.value.batchStoreLoader
  if (!loadStore) {
    console.error(`No batch store loader configured for game: ${gameName.value}`)
    router.push('/')
    return
  }

  try {
    // Load the configured problem generator (already bound to current store settings)
    const { generateProblem } = await loadStore()

    // Generate questions using the pre-configured generator
    const generatedQuestions: string[] = []
    for (let i = 0; i < count.value; i++) {
      generatedQuestions.push(generateProblem())
    }

    questions.value = generatedQuestions
    isLoading.value = false

    // Auto-trigger print dialog after rendering
    setTimeout(() => {
      window.print()
    }, 100)
  } catch (error) {
    console.error('Failed to generate questions:', error)
    router.push('/')
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">Generating...</div>

  <div v-else class="print-container">
    <div
      class="questions-container"
      :style="{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        '--row-gap': `${rowGap}rem`,
        '--item-vertical-padding': `${itemVerticalPadding}rem`,
      }"
    >
      <div v-for="(q, index) in questions" :key="index" class="question-item">
        {{ q }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
}

.print-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.questions-container {
  display: grid;
  gap: var(--row-gap, 0.6rem) 1rem;
}

.question-item {
  font-size: 1.5rem;
  padding: var(--item-vertical-padding, 0.45rem) 0.5rem;
  text-align: left;
  white-space: nowrap;
}

@media print {
  body {
    margin: 0;
    background: white;
  }

  .print-container {
    padding: 1rem;
    max-width: 100%;
  }

  .questions-container {
    gap: var(--row-gap, 0.6rem) 0.5rem;
  }

  .question-item {
    font-size: 1.2rem;
  }
}
</style>
