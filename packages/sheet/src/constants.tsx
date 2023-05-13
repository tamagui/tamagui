import { isClient } from '@tamagui/core'

export const constants = {}

export const SHEET_NAME = 'Sheet'
export const SHEET_HANDLE_NAME = 'SheetHandle'
export const SHEET_OVERLAY_NAME = 'SheetOverlay'

// set all the way off screen
export const HIDDEN_SIZE = 10_000

export const SHEET_HIDDEN_STYLESHEET = isClient ? document.createElement('style') : null
if (SHEET_HIDDEN_STYLESHEET) {
  document.head.appendChild(SHEET_HIDDEN_STYLESHEET)
}
