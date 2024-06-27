import { createAnimations } from '@tamagui/animations-moti'

export const animationsReanimated = createAnimations({
  '75ms': {
    type: 'timing',
    duration: 75,
  },
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
  superBouncy: {
    damping: 5,
    mass: 0.7,
    stiffness: 200,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  quicker: {
    damping: 20,
    mass: 0.7,
    stiffness: 250,
  },
  quickest: {
    damping: 5,
    mass: 0.2,
    stiffness: 300,
  },
})
