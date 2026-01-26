import { createAnimations } from '@tamagui/animations-reanimated'

export const animations = createAnimations({
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
    damping: 10,
    mass: 0.9,
    stiffness: 100,
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
})
