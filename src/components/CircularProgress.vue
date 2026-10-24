<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Progress percentage (0-100) */
  progress: number
  /** Size in pixels (responsive if not specified) */
  size?: number
  /** Stroke width in pixels */
  strokeWidth?: number
  /** Color for progress arc */
  color?: string
  /** Color for background track */
  trackColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: undefined,
  strokeWidth: 12,
  color: '#4a90e2',
  trackColor: '#e0e0e0',
})

// Calculate responsive size
const calculatedSize = computed(() => {
  if (props.size) return props.size
  return 'min(80vw, 80dvh, 500px, 100cqi, calc(100dvh - 80px))'
})

// Calculate radius and circumference
const radius = computed(() => {
  const sizeValue = typeof calculatedSize.value === 'string' ? 250 : calculatedSize.value / 2
  return sizeValue - props.strokeWidth
})

const circumference = computed(() => 2 * Math.PI * radius.value)

const normalizedProgress = computed(() => Math.max(0, Math.min(100, props.progress)))
const strokeDashoffset = computed(() => circumference.value * (1 - normalizedProgress.value / 100))

// Generate viewBox
const viewBox = computed(() => {
  const sizeValue = typeof calculatedSize.value === 'string' ? 500 : calculatedSize.value
  return `0 0 ${sizeValue} ${sizeValue}`
})

// Center coordinate
const center = computed(() => {
  const sizeValue = typeof calculatedSize.value === 'string' ? 250 : calculatedSize.value / 2
  return sizeValue
})
</script>

<template>
  <div class="circular-progress" :style="{ width: calculatedSize, height: calculatedSize }">
    <svg
      :viewBox="viewBox"
      class="progress-svg"
      role="progressbar"
      aria-label="计时进度"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="normalizedProgress"
    >
      <!-- Background track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        class="track"
      />
      <!-- Progress arc -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        class="progress"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.circular-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.track {
  opacity: 0.3;
}

.progress {
  transition: stroke-dashoffset 0.3s ease;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
