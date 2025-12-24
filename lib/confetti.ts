import confetti from 'canvas-confetti'

/**
 * Konfetti Animation Utility
 *
 * Triggers a celebratory confetti animation for successful actions like:
 * - User registration completion
 * - Profile completion
 * - Event registration success
 *
 * URC Falke branding colors:
 * - Primary Blue: #1E3A8A
 * - Orange: #F97316
 *
 * @param options - Optional customization for confetti animation
 */
export function triggerConfetti(options?: {
  /** Duration of the animation in milliseconds (default: 1000ms) */
  duration?: number
  /** Number of confetti particles (default: 50) */
  particleCount?: number
}) {
  const duration = options?.duration ?? 1000
  const particleCount = options?.particleCount ?? 50

  // URC Falke branding colors
  const colors = [
    '#1E3A8A', // Primary Blue
    '#F97316', // Orange
    '#FFFFFF', // White
  ]

  // Calculate animation end time
  const animationEnd = Date.now() + duration

  // Fire confetti from left and right sides
  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    })

    // Continue animation until duration expires
    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame)
    }
  }

  // Start animation
  frame()
}

/**
 * Quick confetti burst for simple celebrations
 */
export function triggerQuickConfetti() {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#1E3A8A', '#F97316', '#FFFFFF'],
  })
}
