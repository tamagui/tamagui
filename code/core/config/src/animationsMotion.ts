import { createAnimations } from '@tamagui/animations-motion'

export const animationsMotion = createAnimations({
  '0ms': {
    duration: 0,
  },
  '30ms': {
    duration: 30,
  },
  '50ms': {
    duration: 50,
  },
  '75ms': {
    duration: 75,
  },
  '100ms': {
    duration: 100,
  },
  '200ms': {
    duration: 200,
  },
  '300ms': {
    duration: 300,
  },
  superBouncy: {
    type: 'spring',
    damping: 3,
    mass: 0.7,
    stiffness: 135,
  },
  bouncy: {
    type: 'spring',
    damping: 5.4,
    mass: 0.9,
    stiffness: 90,
  },
  kindaBouncy: {
    type: 'spring',
    damping: 9.6,
    mass: 1,
    stiffness: 18.75,
  },
  superLazy: {
    type: 'spring',
    damping: 15,
    mass: 2,
    stiffness: 18.75,
  },
  lazy: {
    type: 'spring',
    damping: 10.8,
    mass: 0.2,
    stiffness: 7.5,
  },
  medium: {
    damping: 9.6,
    stiffness: 67.5,
    mass: 0.8,
  },
  slowest: {
    type: 'spring',
    damping: 9,
    stiffness: 7.5,
  },
  slow: {
    type: 'spring',
    damping: 27,
    stiffness: 45,
  },
  quick: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 412.5,
  },
  quickLessBouncy: {
    type: 'spring',
    damping: 40,
    mass: 2,
    stiffness: 400,
    velocity: 5,
  },
  tooltip: {
    type: 'spring',
    damping: 6,
    mass: 0.9,
    stiffness: 75,
  },
  quicker: {
    type: 'spring',
    damping: 12,
    mass: 0.8,
    stiffness: 320,
  },
  quickerLessBouncy: {
    type: 'spring',
    damping: 25,
    mass: 0.45,
    stiffness: 500,
  },
  quickest: {
    damping: 10,
    mass: 0.5,
    stiffness: 520,
  },
  quickestLessBouncy: {
    damping: 14.4,
    mass: 0.35,
    stiffness: 562.5,
  },
})
