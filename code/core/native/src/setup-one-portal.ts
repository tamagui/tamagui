/**
 * Setup native portal support for Tamagui with One's native portals
 * (One.UI.Portal and One.UI.PortalHost), an alternative to setup-teleport.
 *
 * Import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-one-portal'
 * ```
 */

import { getPortal } from './portalState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_portal_setup) return
  g.__tamagui_native_portal_setup = true

  const { One } = require('one')
  // one's portals keep their react tree without a provider and lay content out
  // against the host's own size, so the host fills its parent.
  g.__tamagui_teleport = {
    Portal: One.UI.Portal,
    PortalHost: One.UI.PortalHost,
    hostStyle: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  }
  getPortal().set({ enabled: true, type: 'teleport' })
}

// run setup immediately on import
setup()
