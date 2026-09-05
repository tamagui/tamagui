import type { AnimationsConfig } from '@tamagui/animation-helpers'
import type { AnimationDriverWithAnimatedNumbers } from '@tamagui/web'

import {
  useAnimatedNumber,
  useAnimatedNumberReaction,
  useAnimatedNumberStyle,
  useAnimatedNumbersStyle,
} from './animated-number'
import { createAnimations as createCoreAnimations } from './createAnimations'

export * from './animated-number'

export function createAnimations<A extends AnimationsConfig>(
  animations: A
): AnimationDriverWithAnimatedNumbers<A> {
  return {
    ...createCoreAnimations(animations),
    useAnimatedNumber,
    useAnimatedNumberReaction,
    useAnimatedNumberStyle,
    useAnimatedNumbersStyle,
  }
}
