import { ref, computed, type Ref } from 'vue'

/**
 * Composable for managing question/problem history in game stores.
 */
export function useQuestionHistory<T>(generateFn: () => T) {
  const history: Ref<T[]> = ref([])
  const currentIndex = ref(0)

  // Initialize with first problem if empty
  if (history.value.length === 0) {
    const initialItem = generateFn()
    history.value.push(initialItem)
  }

  const currentItem = computed(() => history.value[currentIndex.value])
  const count = computed(() => currentIndex.value + 1)

  function next() {
    if (currentIndex.value < history.value.length - 1) {
      currentIndex.value++
    } else {
      const newItem = generateFn()
      history.value.push(newItem)
      currentIndex.value = history.value.length - 1
    }
  }

  function previous() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  function resetToFirst() {
    currentIndex.value = 0
  }

  return {
    history,
    currentIndex,
    currentItem,
    count,
    next,
    previous,
    resetToFirst,
  }
}
