/**
 * Setup native portal support for Tamagui.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-teleport'
 * ```
 *
 * This automatically detects and configures react-native-teleport for portals.
 * Falls back to legacy RN shims if teleport is not installed.
 */

import { getPortal } from './portalState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_portal_setup) return
  g.__tamagui_native_portal_setup = true

  // try teleport first (preferred)
  const teleport = require('react-native-teleport')
  if (teleport?.Portal && teleport?.PortalHost && teleport?.PortalProvider) {
    g.__tamagui_teleport = teleport
    getPortal().set({ enabled: true, type: 'teleport' })
    return
  }
}

// run setup immediately on import
setup()
