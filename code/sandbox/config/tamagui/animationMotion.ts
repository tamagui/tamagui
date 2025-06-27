import { createAnimations } from '@tamagui/animations-motion'

export const animationsMotion = createAnimations({
  '75ms': {
    type: 'time',
    duration: 75,
  },
  '100ms': {
    type: 'time',
    duration: 100,
  },
  '200ms': {
    type: 'time',
    duration: 200,
  },
  superBouncy: {
    type: 'spring',
    damping: 5,
    mass: 0.7,
    stiffness: 200,
  },
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  medium: {
    type: 'spring',
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  slow: {
    type: 'spring',
    damping: 15,
    stiffness: 40,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  quicker: {
    type: 'spring',
    damping: 20,
    mass: 0.7,
    stiffness: 250,
  },
  quickest: {
    type: 'spring',
    damping: 5,
    mass: 0.2,
    stiffness: 300,
  },
})
