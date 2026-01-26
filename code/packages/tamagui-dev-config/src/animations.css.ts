import { createAnimations } from '@tamagui/animations-css'

const smoothBezier = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'

export const animationsCSS = createAnimations({
  '0ms': 'ease-in 0ms',
  '50ms': 'ease-in 50ms',
  '75ms': 'ease-in 75ms',
  '100ms': 'ease-in 100ms',
  '200ms': 'ease-in 200ms',
  '250ms': 'ease-in 250ms',
  '300ms': 'ease-in 300ms',
  '400ms': 'ease-in 400ms',
  '500ms': 'ease-in 500ms',
  bouncy: 'ease-in 200ms',
  superBouncy: 'ease-in 500ms',
  lazy: 'ease-in 800ms',
  superLazy: 'ease-in 1000ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 500ms',
  quick: `${smoothBezier} 240ms`,
  quicker: `${smoothBezier} 180ms`,
  quickest: `${smoothBezier} 90ms`,
  tooltip: 'ease-in 400ms',
})
