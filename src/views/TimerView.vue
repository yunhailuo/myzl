<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  MAX_ALERT_SECONDS,
  MAX_DURATION_SECONDS,
  MIN_ALERT_SECONDS,
  useTimerStore,
} from '../stores/timer'
import GameLayout from '../components/GameLayout.vue'
import CircularProgress from '../components/CircularProgress.vue'
import '../assets/game-layout.css'

const MAX_TIME_DIGITS = String(MAX_DURATION_SECONDS).length
const store = useTimerStore()
const timeDigits = ref<string | null>(null)
const displayedTime = computed(() =>
  timeDigits.value !== null ? parseTimeDigits(timeDigits.value).display : store.timeDisplay,
)

function parseTimeDigits(digits: string) {
  const paddedDigits = digits.padStart(4, '0')
  const minutes = Number(paddedDigits.slice(0, -2))
  const seconds = Number(paddedDigits.slice(-2))

  return {
    display: `${paddedDigits.slice(0, -2)}:${paddedDigits.slice(-2)}`,
    totalSeconds: minutes * 60 + seconds,
  }
}

function setTimeDigits(digits: string) {
  const normalizedDigits = digits.replace(/^0+(?=\d)/, '')
  if (normalizedDigits.length > MAX_TIME_DIGITS) return false

  const { totalSeconds } = parseTimeDigits(normalizedDigits)
  if (totalSeconds > MAX_DURATION_SECONDS) return false

  timeDigits.value = normalizedDigits
  store.setDurationSeconds(totalSeconds)
  return true
}

function handlePageKeydown(event: KeyboardEvent) {
  if (
    event.target instanceof HTMLElement &&
    event.target.closest('input, textarea, select, [contenteditable="true"]')
  ) {
    return
  }

  if (event.key === 'Escape') {
    timeDigits.value = null
    return
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
    setTimeDigits(event.key === 'Delete' ? '' : (timeDigits.value ?? '').slice(0, -1))
    return
  }
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
    return
  }

  if (!/^\d$/.test(event.key)) return
  event.preventDefault()
  setTimeDigits(`${timeDigits.value ?? ''}${event.key}`)
}

function handleTimeInput(event: Event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return

  if (!setTimeDigits(input.value.replace(/\D/g, ''))) {
    input.value = timeDigits.value ?? ''
  }
}

function updateAlertSeconds(event: Event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return

  if (Number.isFinite(input.valueAsNumber)) {
    store.setAlertSeconds(input.valueAsNumber)
  }
  input.value = String(store.alertSeconds)
}

onMounted(() => document.addEventListener('keydown', handlePageKeydown))
onUnmounted(() => document.removeEventListener('keydown', handlePageKeydown))

function startTimer() {
  timeDigits.value = null
  store.start()
}

function resetTimer() {
  timeDigits.value = null
  store.reset()
}
</script>

<template>
  <GameLayout :counter-text="`第 ${store.currentLap + 1} 圈`" :show-arrows="false">
    <template #settings>
      <div class="config-item">
        <label class="config-label" for="timer-alert-seconds">
          <span>声音提示（最后）</span>
          <input
            id="timer-alert-seconds"
            :value="store.alertSeconds"
            type="number"
            :min="MIN_ALERT_SECONDS"
            :max="MAX_ALERT_SECONDS"
            class="number-input"
            @change="updateAlertSeconds"
          />
          <span class="unit">秒</span>
        </label>
      </div>

      <div class="config-item">
        <label class="config-label">
          <input v-model="store.isLooping" type="checkbox" />
          <span>自动循环</span>
        </label>
      </div>
    </template>

    <div class="timer-container">
      <CircularProgress :progress="store.progress" class="timer-progress">
        <div class="timer-content">
          <div class="time-entry">
            <div class="time-display" role="timer" aria-live="off">{{ displayedTime }}</div>
            <input
              class="time-entry-input"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              aria-label="设置倒计时，输入数字以设置时长"
              :value="timeDigits ?? ''"
              @input="handleTimeInput"
            />
          </div>

          <div class="controls">
            <button
              v-if="!store.isRunning && !store.isPaused"
              class="control-btn primary"
              :disabled="store.durationMs === 0"
              aria-label="开始"
              @click="startTimer"
            >
              ▶️
            </button>
            <button
              v-if="store.isRunning"
              class="control-btn primary"
              aria-label="暂停"
              @click="store.pause"
            >
              ⏸️
            </button>
            <button
              v-if="store.isPaused"
              class="control-btn primary"
              aria-label="继续"
              @click="store.start"
            >
              ▶️
            </button>
            <button class="control-btn" aria-label="重置" @click="resetTimer">🔄</button>
          </div>
        </div>
      </CircularProgress>
    </div>
  </GameLayout>
</template>

<style scoped>
.timer-container {
  container-type: size;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-progress {
  max-width: min(80vw, 80vh, 500px);
  max-height: min(80vw, 80vh, 500px);
}

.timer-content {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.time-display {
  width: 100%;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #333;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  text-align: center;
}

.time-entry {
  position: relative;
  width: min(75vw, 400px);
  max-width: 100%;
}

.time-entry-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  opacity: 0;
  color: transparent;
  caret-color: transparent;
}

.time-entry:focus-within {
  outline: 2px solid #4a90e2;
  outline-offset: 6px;
  border-radius: 4px;
}

.controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  font-size: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  border-color: #4a90e2;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.primary {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.control-btn.primary:hover {
  background: #357abd;
  border-color: #357abd;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn:disabled:hover {
  border-color: #4a90e2;
  background: #4a90e2;
  transform: none;
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
}

.number-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.unit {
  color: #666;
  font-size: 0.9rem;
}
</style>
