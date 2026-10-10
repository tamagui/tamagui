import { createAnimations } from '@tamagui/animations-css'

export const animations = createAnimations({
  '100ms': '100ms ease-out',
  bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1) 360ms',
  lazy: 'ease-in 600ms',
  medium: 'ease-in 400ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
})
