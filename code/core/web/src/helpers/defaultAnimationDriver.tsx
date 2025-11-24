import type { AnimationDriver } from '../types'

const noAnimationDriver = (method: string): any => {
  console.warn(
    `No animation driver configured. To use ${method}, you must pass \`animations\` to createTamagui. See: https://tamagui.dev/docs/core/animations`
  )
}

const createEmptyAnimationDriver = (): AnimationDriver => ({
  isReactNative: false,
  supportsCSS: true,
  classNameAnimation: true,
  isStub: true,
  animations: {},
  useAnimations: () => noAnimationDriver('animations'),
  usePresence: () => noAnimationDriver('usePresence'),
  ResetPresence: () => noAnimationDriver('ResetPresence'),
  useAnimatedNumber: () => noAnimationDriver('useAnimatedNumber'),
  useAnimatedNumberStyle: () => noAnimationDriver('useAnimatedNumberStyle'),
  useAnimatedNumberReaction: () => noAnimationDriver('useAnimatedNumberReaction'),
})

export const defaultAnimationDriver = createEmptyAnimationDriver()
