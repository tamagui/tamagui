import { useConfiguration } from '../contexts/ComponentContext'
import type {
  AnimationDriver,
  AnimationDriverWithAnimatedNumbers,
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
  if (!animationDriver || animationDriver.isStub) {
    throw new Error(
      `No animation driver configured. Pass \`animations\` to createTamagui. See: https://tamagui.dev/docs/core/animations`
    )
  }
  return animationDriver
}

function useAnimatedNumberDriver(): AnimationDriverWithAnimatedNumbers {
  const driver = useAnimationDriver()
  const animatedDriver = driver as Partial<AnimationDriverWithAnimatedNumbers>
  if (
    typeof animatedDriver.useAnimatedNumber !== 'function' ||
    typeof animatedDriver.useAnimatedNumberStyle !== 'function' ||
    typeof animatedDriver.useAnimatedNumbersStyle !== 'function' ||
    typeof animatedDriver.useAnimatedNumberReaction !== 'function'
  ) {
    throw new Error(
      `The configured animation driver does not include animated-number hooks. When using the CSS driver, import \`createAnimations\` from \`@tamagui/animations-css/extras\` instead of \`@tamagui/animations-css\`. See: https://tamagui.dev/docs/core/animations-css`
    )
  }
  return animatedDriver as AnimationDriverWithAnimatedNumbers
}

export function useAnimatedNumber(initial: number): UniversalAnimatedNumber<any> {
  return useAnimatedNumberDriver().useAnimatedNumber(initial)
}

export const useAnimatedNumberStyle: UseAnimatedNumberStyle = (value, getStyle) =>
  useAnimatedNumberDriver().useAnimatedNumberStyle(value, getStyle)

export const useAnimatedNumbersStyle: UseAnimatedNumbersStyle = (values, getStyle) =>
  useAnimatedNumberDriver().useAnimatedNumbersStyle(values, getStyle)

export const useAnimatedNumberReaction: UseAnimatedNumberReaction = (opts, onValue) =>
  useAnimatedNumberDriver().useAnimatedNumberReaction(opts, onValue)
