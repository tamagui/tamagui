import { createAnimations } from '@tamagui/animations-react-native'

export const animationsReactNative = createAnimations({
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
    stiffness: 180,
  },
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 120,
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
    mass: 0.2,
    stiffness: 10,
  },
  medium: {
    damping: 16,
    stiffness: 90,
    mass: 0.8,
  },
  slowest: {
    type: 'spring',
    damping: 15,
    stiffness: 10,
  },
  slow: {
    type: 'spring',
    damping: 45,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 550,
  },
  quickLessBouncy: {
    type: 'spring',
    damping: 40,
    mass: 2,
    stiffness: 400,
  },
  quicker: {
    type: 'spring',
    damping: 16,
    mass: 0.6,
    stiffness: 700,
  },
  quickerLessBouncy: {
    type: 'spring',
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

export const animations = animationsReactNative
