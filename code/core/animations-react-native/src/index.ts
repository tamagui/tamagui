import type { createAnimations as createNativeAnimations } from './createAnimations'

const unsupportedWebDriverMessage =
  '[@tamagui/animations-react-native] This animation driver only works on native. On web, use @tamagui/animations-css, @tamagui/animations-motion, or @tamagui/animations-reanimated.'

export const createAnimations: typeof createNativeAnimations = () => {
  throw new Error(unsupportedWebDriverMessage)
}
