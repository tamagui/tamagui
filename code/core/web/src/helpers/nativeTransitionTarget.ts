import type { NativeTransitionTarget } from '@tamagui/style-grammar'

// web build: there is no native target to detect
export function detectNativeTransitionTarget(): NativeTransitionTarget | null {
  return null
}
