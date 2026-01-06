import { createAnimations } from '@tamagui/animations-motion'

  export const animationsMotion = createAnimations({
    '75ms': {
      duration: 0.075,
    },
    '100ms': {
      duration: 0.1,
    },
    '200ms': {
      duration: 0.2,
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
      damping: 25,
      mass: 0.45,
      stiffness: 500,
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
    select: {
      damping: 45,
      mass: 0.5,
      stiffness: 1000,
    },
  })
