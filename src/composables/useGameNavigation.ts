import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Composable for handling keyboard and swipe navigation in game views.
 */
export function useGameNavigation(
  onNext: () => void,
  onPrev: () => void,
  enabled: boolean | (() => boolean),
) {
  const startX = ref(0)
  const startY = ref(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    const isEnabled = typeof enabled === 'function' ? enabled() : enabled
    if (!isEnabled) return

    if (e.key === 'ArrowRight') {
      onNext()
    } else if (e.key === 'ArrowLeft') {
      onPrev()
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      startX.value = e.touches[0]!.clientX
      startY.value = e.touches[0]!.clientY
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const isEnabled = typeof enabled === 'function' ? enabled() : enabled
    if (!isEnabled || !startX.value || !startY.value || e.changedTouches.length === 0) return

    const diffX = startX.value - e.changedTouches[0]!.clientX
    const diffY = startY.value - e.changedTouches[0]!.clientY

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        onNext()
      } else {
        onPrev()
      }
    }

    startX.value = 0
    startY.value = 0
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchend', handleTouchEnd)
  })
}
