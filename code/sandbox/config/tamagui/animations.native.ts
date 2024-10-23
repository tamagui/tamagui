import { createAnimations } from '@tamagui/animations-moti'

export const animations = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 200,
  },
  quicker: {
    damping: 21,
    mass: 1.1,
    stiffness: 250,
  },
  quickest: {
    damping: 22,
    mass: 1,
    stiffness: 300,
  },
})
