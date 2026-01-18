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
  kindaBouncy: {
    type: 'spring',
    damping: 16,
    mass: 1,
    stiffness: 25,
  },
  superLazy: {
    type: 'spring',
    damping: 25,
    mass: 2,
    stiffness: 25,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 16,
    stiffness: 120,
    mass: 0.8,
  },
  slowest: {
    type: 'spring',
    damping: 15,
    stiffness: 10,
  },
  slow: {
    type: 'spring',
    damping: 15,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    type: 'spring',
    damping: 25,
    mass: 0.45,
    stiffness: 500,
  },
  quicker: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 250,
  },
  quickest: {
    damping: 14,
    mass: 0.1,
    stiffness: 380,
  },
  select: {
    damping: 45,
    mass: 0.5,
    stiffness: 1000,
  },
  menu: {
    type: 'spring',
    damping: 20,
    mass: 0.7,
    stiffness: 250,
  },
})
