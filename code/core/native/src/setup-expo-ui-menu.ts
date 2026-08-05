/**
 * Setup Expo UI for Tamagui native Menu and ContextMenu components.
 *
 * Import this module once at the top of the app entry point after installing
 * `@expo/ui`.
 */

import { createExpoUIMenuAdapter } from './expoUIMenuAdapter'
import { registerNativeMenuAdapter } from './nativeMenuState'

function setup(): void {
  let MenuView
  try {
    MenuView = require('@expo/ui/community/menu').MenuView
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error setting up Expo UI native menus', error)
    }
    return
  }

  registerNativeMenuAdapter(createExpoUIMenuAdapter({ MenuView }))
}

setup()
