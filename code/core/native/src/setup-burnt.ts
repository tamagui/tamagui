/**
 * Setup burnt for Tamagui native toasts.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-burnt'
 * ```
 *
 * This automatically detects and configures burnt for use with
 * native Toast functionality.
 */

import { getBurnt } from './burntState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_burnt_setup) return
  g.__tamagui_native_burnt_setup = true

  try {
    const Burnt = require('burnt') as typeof import('burnt')

    if (Burnt) {
      getBurnt().set({
        enabled: true,
        toast: Burnt.toast,
        dismissAllAlerts: Burnt.dismissAllAlerts,
      })
    }
  } catch {
    // burnt not installed
  }
}

// run setup immediately on import
setup()
