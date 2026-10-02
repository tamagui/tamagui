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
 * This automatically detects and configures react-native-teleport for portals,
 * or One's native portals (One.UI.Portal) when teleport is not installed.
 * Falls back to legacy RN shims if neither is installed.
 */

import { getPortal } from './portalState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_portal_setup) return
  g.__tamagui_native_portal_setup = true

  // try teleport first (preferred)
  try {
    const teleport = require('react-native-teleport')
    if (teleport?.Portal && teleport?.PortalHost && teleport?.PortalProvider) {
      g.__tamagui_teleport = teleport
      getPortal().set({ enabled: true, type: 'teleport' })
      return
    }
  } catch {
    // react-native-teleport not installed, that's ok
  }

  // one's portals keep their react tree without a provider, and lay content
  // out against the host's own size, so the host fills its parent.
  try {
    const { One } = require('one')
    if (One?.UI?.Portal && One.UI.PortalHost) {
      g.__tamagui_teleport = {
        Portal: One.UI.Portal,
        PortalHost: One.UI.PortalHost,
        hostStyle: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
      }
      getPortal().set({ enabled: true, type: 'teleport' })
    }
  } catch {
    // one not installed, that's ok
  }
}

// run setup immediately on import
setup()
