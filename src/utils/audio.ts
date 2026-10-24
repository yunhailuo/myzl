interface ToneOptions {
  frequency: number
  endFrequency?: number
  duration: number
  volume: number
}

function reportAudioError(error: unknown) {
  console.warn('Unable to play timer audio', error)
}

function playTone({ frequency, endFrequency, duration, volume }: ToneOptions) {
  if (typeof window === 'undefined') return

  try {
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    if (endFrequency !== undefined) {
      oscillator.frequency.linearRampToValueAtTime(endFrequency, context.currentTime + duration)
    }

    gain.gain.setValueAtTime(volume, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)
    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + duration)

    window.setTimeout(
      () => {
        void context.close().catch(reportAudioError)
      },
      duration * 1000 + 100,
    )
  } catch (error) {
    reportAudioError(error)
  }
}

export function playTickSound(): void {
  playTone({ frequency: 1200, duration: 0.18, volume: 0.45 })
}

export function playCompleteSound(): void {
  playTone({ frequency: 750, endFrequency: 1350, duration: 0.6, volume: 0.55 })
}
