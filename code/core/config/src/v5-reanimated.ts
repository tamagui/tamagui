import { createAnimations } from '@tamagui/animations-reanimated'

export const animationsReanimated = createAnimations({
  '0ms': {
    type: 'timing',
    duration: 0,
  },
  '50ms': {
    type: 'timing',
    duration: 50,
  },
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
  '250ms': {
    type: 'timing',
    duration: 250,
  },
  '300ms': {
    type: 'timing',
    duration: 300,
  },
  '400ms': {
    type: 'timing',
    duration: 400,
  },
  '500ms': {
    type: 'timing',
    duration: 500,
  },
  superBouncy: {
    damping: 5,
    mass: 0.7,
    stiffness: 180,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 120,
  },
  superLazy: {
    damping: 25,
    mass: 2,
    stiffness: 25,
  },
  medium: {
    damping: 16,
    stiffness: 90,
    mass: 0.8,
  },
  lazy: {
    damping: 18,
    mass: 0.2,
    stiffness: 10,
  },
  slowest: {
    damping: 15,
    stiffness: 10,
  },
  slow: {
    damping: 45,
    stiffness: 60,
  },
  quick: {
    damping: 25,
    mass: 1,
    stiffness: 550,
  },
  quickLessBouncy: {
    damping: 40,
    mass: 2,
    stiffness: 400,
  },
  quicker: {
    damping: 16,
    mass: 0.6,
    stiffness: 700,
  },
  quickerLessBouncy: {
    damping: 27,
    mass: 0.45,
    stiffness: 750,
  },
  quickest: {
    damping: 15,
    mass: 0.6,
    stiffness: 400,
  },
  quickestLessBouncy: {
    damping: 24,
    mass: 0.35,
    stiffness: 750,
  },
})

export const animations = animationsReanimated
