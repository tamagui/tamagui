// native stub - animations-motion only works on web (uses framer-motion/motion library)
// on native, use @tamagui/animations-react-native or @tamagui/animations-reanimated

import type { AnimationDriverStub } from '@tamagui/web'

let hasWarnedOnce = false

export function createAnimations<A extends Record<string, any>>(
  _animations: A
): AnimationDriverStub<A> {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarnedOnce) {
      hasWarnedOnce = true
      console.warn(
        '[@tamagui/animations-motion] This animation driver only works on web. On native, use @tamagui/animations-react-native or @tamagui/animations-reanimated instead.'
      )
    }
  }

  // return an explicit unsupported driver so config resolution can skip it
  return {
    isReactNative: false,
    isStub: true,
    animations: _animations,
    View: undefined as any,
    Text: undefined as any,
  }
}
