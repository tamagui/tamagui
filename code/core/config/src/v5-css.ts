import { createAnimations } from '@tamagui/animations-css'

const easeOut = 'cubic-bezier(0.25, 0.1, 0.25, 1)'
const bouncy = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

export const animationsCSS = createAnimations({
  '0ms': '0ms linear',
  '50ms': '50ms linear',
  '75ms': '75ms linear',
  '100ms': '100ms ease-out',
  '200ms': '200ms ease-out',
  '250ms': '250ms ease-out',
  '300ms': '300ms ease-out',
  '400ms': '400ms ease-out',
  '500ms': '500ms ease-out',
  superBouncy: `300ms cubic-bezier(0.175, 0.885, 0.32, 1.5)`,
  bouncy: `350ms ${bouncy}`,
  superLazy: `600ms ${easeOut}`,
  lazy: `500ms ${easeOut}`,
  medium: `300ms ${easeOut}`,
  slowest: `800ms ${easeOut}`,
  slow: `450ms ${easeOut}`,
  quick: `150ms ${easeOut}`,
  quickLessBouncy: `180ms ${easeOut}`,
  quicker: `120ms ${easeOut}`,
  quickerLessBouncy: `100ms ${easeOut}`,
  quickest: `80ms ${easeOut}`,
  quickestLessBouncy: `60ms ${easeOut}`,
})

export const animations = animationsCSS
