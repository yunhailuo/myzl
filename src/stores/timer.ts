import { computed, onScopeDispose, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { playCompleteSound, playTickSound } from '../utils/audio'
import { safeStorage } from '../utils/storage'

const MIN_DURATION_SECONDS = 0
export const MAX_DURATION_SECONDS = 99 * 60
export const MIN_ALERT_SECONDS = 1
export const MAX_ALERT_SECONDS = 15
const TIMER_UPDATE_INTERVAL_MS = 100

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export const useTimerStore = defineStore(
  'timer',
  () => {
    const durationMinutes = ref(5)
    const alertSeconds = ref(5)
    const isRunning = ref(false)
    const isPaused = ref(false)
    const remainingTime = ref(0)
    const isLooping = ref(true)
    const currentLap = ref(0)

    const durationMs = computed(() => durationMinutes.value * 60_000)
    const progress = computed(() => {
      if (durationMs.value === 0) return 0
      return Math.max(
        0,
        Math.min(100, ((durationMs.value - remainingTime.value) / durationMs.value) * 100),
      )
    })
    const remainingSeconds = computed(() => Math.ceil(remainingTime.value / 1000))
    const timeDisplay = computed(() => {
      const totalSeconds = remainingSeconds.value
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })
    let intervalId: ReturnType<typeof setInterval> | undefined
    let lastUpdateTime = 0
    let lastAlertSecond = -1

    function clearTimerInterval() {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
        intervalId = undefined
      }
    }

    function completeLap() {
      playCompleteSound()

      if (isLooping.value) {
        currentLap.value++
        remainingTime.value = durationMs.value
        lastUpdateTime = performance.now()
        lastAlertSecond = -1
      } else {
        isRunning.value = false
        isPaused.value = false
        remainingTime.value = 0
        lastAlertSecond = -1
        clearTimerInterval()
      }
    }

    function playAlertIfNeeded() {
      const seconds = remainingSeconds.value
      if (seconds > 0 && seconds <= alertSeconds.value && seconds !== lastAlertSecond) {
        playTickSound()
        lastAlertSecond = seconds
      }
    }

    function updateCountdown() {
      if (!isRunning.value) return

      const now = performance.now()
      const elapsed = now - lastUpdateTime
      lastUpdateTime = now
      remainingTime.value = Math.max(0, remainingTime.value - elapsed)

      if (remainingTime.value === 0) {
        completeLap()
      } else {
        playAlertIfNeeded()
      }
    }

    function start() {
      if (isRunning.value || durationMs.value === 0) return

      if (remainingTime.value === 0) {
        remainingTime.value = durationMs.value
        currentLap.value = 0
        lastAlertSecond = -1
      }

      isRunning.value = true
      isPaused.value = false
      lastUpdateTime = performance.now()
      clearTimerInterval()
      intervalId = setInterval(updateCountdown, TIMER_UPDATE_INTERVAL_MS)
      playAlertIfNeeded()
    }

    function pause() {
      if (!isRunning.value) return

      updateCountdown()
      if (!isRunning.value) return

      isRunning.value = false
      isPaused.value = true
      clearTimerInterval()
    }

    function reset() {
      clearTimerInterval()
      isRunning.value = false
      isPaused.value = false
      remainingTime.value = durationMs.value
      currentLap.value = 0
      lastAlertSecond = -1
    }

    function setDurationSeconds(seconds: number) {
      if (!Number.isFinite(seconds)) {
        throw new RangeError('Timer duration must be a finite number')
      }

      const boundedSeconds = clamp(Math.round(seconds), MIN_DURATION_SECONDS, MAX_DURATION_SECONDS)
      durationMinutes.value = boundedSeconds / 60
      remainingTime.value = durationMs.value
      lastAlertSecond = -1
      if (boundedSeconds === 0) {
        clearTimerInterval()
        isRunning.value = false
        isPaused.value = false
      } else if (isRunning.value) {
        lastUpdateTime = performance.now()
      }
    }

    function setAlertSeconds(seconds: number) {
      if (!Number.isFinite(seconds)) {
        throw new RangeError('Alert threshold must be a finite number')
      }

      alertSeconds.value = clamp(Math.round(seconds), MIN_ALERT_SECONDS, MAX_ALERT_SECONDS)
    }

    remainingTime.value = durationMs.value

    // The configured duration is persisted, but the active countdown is not.
    // Keep the idle display in sync when persisted settings hydrate the store.
    watch(
      durationMinutes,
      () => {
        durationMinutes.value = clamp(durationMinutes.value, 0, MAX_DURATION_SECONDS / 60)
        if (!isRunning.value && !isPaused.value) {
          remainingTime.value = durationMs.value
        }
      },
      { flush: 'sync' },
    )

    watch(
      alertSeconds,
      () => {
        alertSeconds.value = clamp(
          Math.round(alertSeconds.value),
          MIN_ALERT_SECONDS,
          MAX_ALERT_SECONDS,
        )
      },
      { flush: 'sync' },
    )

    onScopeDispose(clearTimerInterval)

    return {
      durationMinutes,
      alertSeconds,
      isRunning,
      isPaused,
      remainingTime,
      isLooping,
      currentLap,
      durationMs,
      progress,
      remainingSeconds,
      timeDisplay,
      start,
      pause,
      reset,
      setDurationSeconds,
      setAlertSeconds,
    }
  },
  {
    persist: {
      pick: ['durationMinutes', 'alertSeconds', 'isLooping'],
      storage: safeStorage,
    },
  },
)
