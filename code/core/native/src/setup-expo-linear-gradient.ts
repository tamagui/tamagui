/**
 * Setup expo-linear-gradient for Tamagui.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-expo-linear-gradient'
 * ```
 *
 * This automatically detects and configures expo-linear-gradient.
 * If not installed, LinearGradient will log a warning on native.
 */

import { getLinearGradient } from './linearGradientState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_linear_gradient_setup) return
  g.__tamagui_native_linear_gradient_setup = true

  try {
    const expoLinearGradient = require('expo-linear-gradient')
    if (expoLinearGradient?.LinearGradient) {
      getLinearGradient().set({
        enabled: true,
        Component: expoLinearGradient.LinearGradient,
      })
    }
  } catch {
    // expo-linear-gradient not installed, will use CSS fallback
  }
}

// run setup immediately on import
setup()
