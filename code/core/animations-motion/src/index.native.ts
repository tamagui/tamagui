// native stub - animations-motion only works on web (uses framer-motion/motion library)
// on native, use @tamagui/animations-react-native or @tamagui/animations-reanimated

import type { AnimationDriver } from '@tamagui/web'

let hasWarnedOnce = false

export function createAnimations<A extends Record<string, any>>(
  _animations: A
): AnimationDriver<A> {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarnedOnce) {
      hasWarnedOnce = true
      console.warn(
        '[@tamagui/animations-motion] This animation driver only works on web. On native, use @tamagui/animations-react-native or @tamagui/animations-reanimated instead.'
      )
    }
  }

  // return a noop driver
  // @ts-expect-error its an error anyway
  return {
    isReactNative: false,
    animations: _animations,
    View: undefined as any,
    Text: undefined as any,
  }
}
