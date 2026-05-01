<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  title?: string
  counterText: string
  showArrows: boolean
  disableLeftArrow?: boolean
  disableRightArrow?: boolean
}

const route = useRoute()
const router = useRouter()
defineProps<Props>()

// Auto-detect batch support from route meta (safely handle undefined in tests)
const supportsBatch = computed(() => route?.meta?.supportsBatch === true)

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
}>()

const showConfig = ref(false)
const configBtnRef = ref<HTMLButtonElement>()
const closeBtnRef = ref<HTMLButtonElement>()
const showBatchDialog = ref(false)
const batchQuestionCount = ref(20)
const localQuestionCount = ref(batchQuestionCount.value)
const columns = ref(3)
const questionCountInput = ref<HTMLInputElement | null>(null)

// Sync local state with prop changes
watch(
  () => batchQuestionCount.value,
  (newVal) => {
    localQuestionCount.value = newVal
  },
)

// Focus the first input when dialog opens
watch(
  () => showBatchDialog.value,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        questionCountInput.value?.focus()
      })
    }
  },
)

const toggleConfig = async () => {
  showConfig.value = !showConfig.value
  if (showConfig.value) {
    await nextTick()
    closeBtnRef.value?.focus()
  } else {
    configBtnRef.value?.focus()
  }
}

const openBatchDialog = () => {
  showBatchDialog.value = true
}

const closeBatchDialog = () => {
  showBatchDialog.value = false
}

const handleBatchGenerate = () => {
  const count = Math.max(1, Math.min(1000, localQuestionCount.value))
  const cols = Math.max(1, Math.min(6, columns.value))

  const gamePath = route.path.startsWith('/') ? route.path : `/${route.path}`
  const batchPath = `${gamePath}/batch`

  const batchUrl = router.resolve({
    path: batchPath,
    query: {
      count: count.toString(),
      columns: cols.toString(),
    },
  })

  window.open(batchUrl.href, '_blank')
  closeBatchDialog()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (showConfig.value) {
      toggleConfig()
    } else if (showBatchDialog.value) {
      closeBatchDialog()
    }
  }
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="game">
    <div class="header">
      <div class="counter">{{ counterText }}</div>
      <div class="header-actions">
        <slot name="header-actions"></slot>
        <button
          v-if="supportsBatch"
          class="batch-btn"
          @click="openBatchDialog"
          aria-label="Batch Generate Questions"
          title="批量生成题目"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"
            />
          </svg>
        </button>
        <button ref="configBtnRef" class="config-btn" @click="toggleConfig" aria-label="Settings">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div :class="['config-panel', { open: showConfig }]">
      <div class="config-header">
        <span class="config-title">设置</span>
        <button ref="closeBtnRef" class="close-btn" @click="toggleConfig" aria-label="Close">
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
      <slot name="settings"></slot>
    </div>

    <div :class="['config-overlay', { active: showConfig }]" @click="toggleConfig"></div>

    <button
      v-if="showArrows"
      class="nav-btn left"
      @click="handlePrev"
      :disabled="disableLeftArrow"
      aria-label="Previous"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>

    <div :class="['question-area', { 'full-width': !showArrows }]">
      <slot></slot>
    </div>

    <button
      v-if="showArrows"
      class="nav-btn right"
      @click="handleNext"
      :disabled="disableRightArrow"
      aria-label="Next"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </button>

    <!-- Batch Generate Dialog -->
    <Teleport v-if="supportsBatch" to="body">
      <Transition name="fade">
        <div v-if="showBatchDialog" class="batch-dialog-overlay" @click.self="closeBatchDialog">
          <div class="batch-dialog">
            <div class="dialog-header">
              <h2>批量生成题目</h2>
              <button class="close-btn" @click="closeBatchDialog" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="dialog-body">
              <div class="config-section">
                <label class="config-label">
                  <span>题目数量</span>
                  <input
                    ref="questionCountInput"
                    v-model.number="localQuestionCount"
                    type="number"
                    min="1"
                    max="1000"
                    class="number-input"
                  />
                </label>

                <label class="config-label">
                  <span>每页栏数</span>
                  <input
                    v-model.number="columns"
                    type="number"
                    min="1"
                    max="6"
                    class="number-input"
                  />
                </label>
              </div>

              <div class="action-buttons">
                <button class="action-btn primary" @click="handleBatchGenerate">
                  生成并打开新页面
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.batch-btn,
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

.batch-btn:hover,
.config-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.batch-btn svg,
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

.batch-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.batch-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  padding: 1rem;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dialog-header h2 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.dialog-header .close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.dialog-header .close-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
}

.config-label span {
  font-weight: bold;
  color: #333;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  text-align: right;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-btn.primary {
  background: #007bff;
}

.action-btn.primary:hover {
  background: #0056b3;
}

@media (max-width: 600px) {
  .game {
    grid-template-columns: 40px 1fr 40px;
  }

  .nav-btn {
    width: 40px;
  }

  .batch-btn,
  .config-btn {
    width: 36px;
    height: 36px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
