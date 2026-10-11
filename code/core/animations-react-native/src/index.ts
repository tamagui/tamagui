import type { AnimationsConfig } from '@tamagui/animation-helpers'
import type { AnimationDriverWithAnimatedNumbers } from '@tamagui/web'

import type { CreateAnimationsOptions } from './types'

export type { CreateAnimationsOptions }

const unsupportedWebDriverMessage =
  '[@tamagui/animations-react-native] This animation driver only works on native. On web, use @tamagui/animations-css, @tamagui/animations-motion, or @tamagui/animations-reanimated.'

/**
 * The web half of the native driver. It keeps the same signature so a shared
 * config typechecks on both platforms, and throws if anything actually reaches
 * for it: `Animated` lives in react-native, which web is not tied to.
 */
export const createAnimations = <A extends AnimationsConfig>(
  _animations: A,
  _options?: CreateAnimationsOptions
): AnimationDriverWithAnimatedNumbers<A> => {
  throw new Error(unsupportedWebDriverMessage)
}
