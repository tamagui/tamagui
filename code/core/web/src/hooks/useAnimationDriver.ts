import { useConfiguration } from '../contexts/ComponentContext'
import type {
  AnimationDriver,
  UniversalAnimatedNumber,
  UseAnimatedNumberReaction,
  UseAnimatedNumberStyle,
  UseAnimatedNumbersStyle,
} from '../types'

// resolves the configured animation driver from context/config. the wrappers below
// delegate to it directly so first-party code and user code exercise the same surface.
// the resolved driver must not change identity mid-lifecycle (only relevant with
// `animatedBy` multi-driver setups).
export function useAnimationDriver(): AnimationDriver {
  const { animationDriver } = useConfiguration()
  if (process.env.NODE_ENV === 'development') {
    if (!animationDriver || animationDriver.isStub) {
      throw new Error(
        `No animation driver configured. To use the animation hooks (useAnimatedNumber, useAnimatedNumberStyle, ...), pass \`animations\` to createTamagui. See: https://tamagui.dev/docs/core/animations`
      )
    }
  }
  return animationDriver!
}

export function useAnimatedNumber(initial: number): UniversalAnimatedNumber<any> {
  return useAnimationDriver().useAnimatedNumber(initial)
}

export const useAnimatedNumberStyle: UseAnimatedNumberStyle = (value, getStyle) =>
  useAnimationDriver().useAnimatedNumberStyle(value, getStyle)

export const useAnimatedNumbersStyle: UseAnimatedNumbersStyle = (values, getStyle) =>
  useAnimationDriver().useAnimatedNumbersStyle(values, getStyle)

export const useAnimatedNumberReaction: UseAnimatedNumberReaction = (opts, onValue) =>
  useAnimationDriver().useAnimatedNumberReaction(opts, onValue)
