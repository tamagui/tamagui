/**
 * Setup react-native-safe-area-context for Tamagui native components.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-safe-area'
 * ```
 *
 * This automatically detects and configures react-native-safe-area-context
 * for use with Tamagui components that need safe area awareness.
 *
 * Note: You must still wrap your app with SafeAreaProvider yourself:
 * ```tsx
 * import { SafeAreaProvider } from 'react-native-safe-area-context'
 * <SafeAreaProvider>
 *   <App />
 * </SafeAreaProvider>
 * ```
 *
 * On web, this is a no-op since CSS env(safe-area-inset-*) values work natively.
 */

import { getSafeArea } from './safeAreaState'

function setup() {
  // only run on native
  if (process.env.TAMAGUI_TARGET !== 'native') {
    return
  }

  const g = globalThis as any
  if (g.__tamagui_native_safe_area_setup_complete) {
    return
  }
  g.__tamagui_native_safe_area_setup_complete = true

  try {
    const safeAreaContext = require('react-native-safe-area-context')
    const { useSafeAreaInsets, useSafeAreaFrame, initialWindowMetrics } = safeAreaContext

    if (useSafeAreaInsets) {
      getSafeArea().set({
        enabled: true,
        useSafeAreaInsets,
        useSafeAreaFrame: useSafeAreaFrame || null,
        initialMetrics: initialWindowMetrics || null,
      })
    }
  } catch {
    // react-native-safe-area-context not available
  }
}

setup()
