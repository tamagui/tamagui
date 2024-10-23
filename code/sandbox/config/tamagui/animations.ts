import { createAnimations } from '@tamagui/animations-css'

const smoothBezier = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'

const cssTransitions = {
  '100ms': 'ease-in 100ms',
  '200ms': 'ease-in 200ms',
  quick: `${smoothBezier} 500ms`,
  quicker: `${smoothBezier} 350ms`,
  quickest: `${smoothBezier} 200ms`,
}

export const animations = createAnimations(cssTransitions)
