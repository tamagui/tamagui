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

import { useLayoutEffect } from 'react'
import {
  initialWindowMetrics,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { getSafeArea } from './safeAreaState'

function setup() {
  const safeArea = getSafeArea()
  safeArea.set({ didSetup: true })

  const useTrackedSafeAreaInsets = () => {
    const insets = useSafeAreaInsets()
    const frame = useSafeAreaFrame()

    useLayoutEffect(() => {
      safeArea.set({
        initialMetrics: {
          insets,
          frame,
        },
      })
    }, [insets, frame])

    return insets
  }

  safeArea.set({
    enabled: true,
    useSafeAreaInsets: useTrackedSafeAreaInsets,
    useSafeAreaFrame,
    initialMetrics: initialWindowMetrics,
  })
}

setup()
