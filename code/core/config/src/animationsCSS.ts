import { createAnimations as c1 } from '@tamagui/animations-css'

const easeOut = 'cubic-bezier(0.25, 0.1, 0.25, 1)'
const bouncy = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
const kindaBouncyBezier = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export const animationsCSS = c1({
  '0ms': '0ms linear',
  '30ms': '30ms linear',
  '50ms': '50ms linear',
  '75ms': '75ms linear',
  '100ms': '100ms ease-out',
  '200ms': '200ms ease-out',
  '300ms': '300ms ease-out',
  superBouncy: `300ms cubic-bezier(0.175, 0.885, 0.32, 1.5)`,
  bouncy: `350ms ${bouncy}`,
  kindaBouncy: `400ms ${kindaBouncyBezier}`,
  superLazy: `600ms ${easeOut}`,
  lazy: `500ms ${easeOut}`,
  medium: `300ms ${easeOut}`,
  slowest: `800ms ${easeOut}`,
  slow: `450ms ${easeOut}`,
  quick: `150ms ${easeOut}`,
  quickLessBouncy: `180ms ${easeOut}`,
  tooltip: `200ms cubic-bezier(0.175, 0.885, 0.32, 1.1)`,
  quicker: `120ms ${easeOut}`,
  quickerLessBouncy: `100ms ${easeOut}`,
  quickest: `80ms ${easeOut}`,
  quickestLessBouncy: `60ms ${easeOut}`,
})
