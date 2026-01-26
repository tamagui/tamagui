import { createAnimations } from '@tamagui/animations-react-native'

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
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
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
})
