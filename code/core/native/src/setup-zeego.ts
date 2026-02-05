/**
 * Setup zeego for Tamagui native menus.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-zeego'
 * ```
 *
 * This automatically detects and configures zeego for use with
 * Menu and ContextMenu native mode.
 */

import { getZeego } from './zeegoState'

function setup(): void {
  const g = globalThis as any
  if (g.__tamagui_native_zeego_setup) return
  g.__tamagui_native_zeego_setup = true

  try {
    const DropdownMenu = require('zeego/dropdown-menu')
    const ContextMenu = require('zeego/context-menu')

    if (DropdownMenu && ContextMenu) {
      getZeego().set({
        enabled: true,
        DropdownMenu,
        ContextMenu,
      })
    }
  } catch {
    // zeego not installed
  }
}

// run setup immediately on import
setup()
