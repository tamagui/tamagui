import { createAnimations } from '@tamagui/animations-css'

const smoothBezier = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'

export const animationsCSS = createAnimations({
  '75ms': 'ease-in 75ms',
  '100ms': 'ease-in 100ms',
  '200ms': 'ease-in 200ms',
  bouncy: 'ease-in 200ms',
  superBouncy: 'ease-in 500ms',
  lazy: 'ease-in 1000ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 500ms',
  quick: `${smoothBezier} 400ms`,
  quicker: `${smoothBezier} 300ms`,
  quickest: `${smoothBezier} 200ms`,
  tooltip: 'ease-in 400ms',
})
