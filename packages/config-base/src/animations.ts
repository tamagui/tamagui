import { createAnimations } from '@tamagui/animations-react-native'
import { Animated } from 'react-native-web-lite'
// @ts-ignore
import * as AnimatedImpl from 'react-native-web-lite/animated'

// TODO more work...

Animated.installAnimated(AnimatedImpl)

export const animations = createAnimations({
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
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
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
})
