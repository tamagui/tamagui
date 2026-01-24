/**
 * Setup worklets for Tamagui native components.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-worklets'
 * ```
 *
 * This automatically detects and configures react-native-worklets-core
 * for use with Sheet and other components that benefit from synchronous
 * native-thread execution.
 *
 * When combined with setup-gesture-handler, Sheet gets native-quality
 * gesture coordination between sheet dragging and scroll views.
 *
 * @see https://docs.swmansion.com/react-native-worklets/docs/
 */

import { getWorklets } from './workletsState'

function setup() {
  const g = globalThis as any
  if (g.__tamagui_native_worklets_setup_complete) {
    return
  }
  g.__tamagui_native_worklets_setup_complete = true

  try {
    // dynamically require worklets-core
    const worklets = require('react-native-worklets-core')

    if (worklets) {
      getWorklets().set({
        enabled: true,
        Worklets: worklets.Worklets,
        useRunOnJS: worklets.useRunOnJS,
        useWorklet: worklets.useWorklet,
        createWorkletContextValue: worklets.createWorkletContextValue,
      })
    }
  } catch {
    // worklets not available, that's fine - will fall back to JS thread
  }
}

// run setup immediately on import
setup()
