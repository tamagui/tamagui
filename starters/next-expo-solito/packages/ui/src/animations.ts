import { createAnimations } from '@tamagui/animations-react-native'
// tried using createReanimatedAnimations and kept getting an error with
// TypeError: Cannot read property 'length' of undefined
// This error is located at:
//     in Square (created by TamaguiAnimationDemo)
//     in TamaguiAnimationDemo (created by HomeScreen)
//     in RCTView (created by View)

import { createAnimations as createReanimatedAnimations } from '@tamagui/animations-reanimated'

export const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})

export const reanimatedAnimations = createReanimatedAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
})
