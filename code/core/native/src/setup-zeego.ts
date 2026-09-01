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

import { registerNativeMenuAdapter } from './nativeMenuState'

function setup(): void {
  let Menu
  let ContextMenu
  try {
    Menu = require('zeego/dropdown-menu')
    ContextMenu = require('zeego/context-menu')
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error setting up Zeego`, err)
    }
    return
  }

  registerNativeMenuAdapter({
    name: 'zeego',
    Menu,
    ContextMenu,
  })
}

// run setup immediately on import
setup()
