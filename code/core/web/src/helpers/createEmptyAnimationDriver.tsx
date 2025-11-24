import type { AnimationDriver } from '../types'

const noAnimationDriver = (method: string): never => {
  throw new Error(
    `No animation driver configured. To use ${method}, you must pass \`animations\` to createTamagui. See: https://tamagui.dev/docs/core/animations`
  )
}

export const createEmptyAnimationDriver = (): AnimationDriver => ({
  isReactNative: false,
  animations: {},
  useAnimations: () => noAnimationDriver('animations'),
  usePresence: () => noAnimationDriver('usePresence'),
  ResetPresence: () => noAnimationDriver('ResetPresence'),
  useAnimatedNumber: () => noAnimationDriver('useAnimatedNumber'),
  useAnimatedNumberStyle: () => noAnimationDriver('useAnimatedNumberStyle'),
  useAnimatedNumberReaction: () => noAnimationDriver('useAnimatedNumberReaction'),
})
