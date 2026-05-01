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
    const storeModule = await loadStore()
    const { generateProblem } = storeModule

    // Generate questions
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
    <div class="questions-container" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
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
  gap: 1rem;
}

.question-item {
  font-size: 1.5rem;
  padding: 0.5rem;
  text-align: center;
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
    gap: 0.5rem;
  }

  .question-item {
    font-size: 1.2rem;
  }
}
</style>
