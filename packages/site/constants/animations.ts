import { createAnimations } from '@tamagui/animations-reanimated'
// import { createAnimations } from '@tamagui/animations-css'

export const animations = createAnimations({
  // bouncy: 'ease-in 300ms',
  // lazy: 'ease-in 500ms',
  // quick: 'ease-in 100ms',
  // tooltip: 'ease-in 150ms',
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 150,
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
})
