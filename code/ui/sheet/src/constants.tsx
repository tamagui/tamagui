import { isClient } from '@tamagui/core'

export const constants = {}

export const SHEET_NAME = 'Sheet'
export const SHEET_HANDLE_NAME = 'SheetHandle'
export const SHEET_OVERLAY_NAME = 'SheetOverlay'

export const SHEET_HIDDEN_STYLESHEET = isClient ? document.createElement('style') : null
if (SHEET_HIDDEN_STYLESHEET) {
  if (typeof document.head !== 'undefined') {
    document.head.appendChild(SHEET_HIDDEN_STYLESHEET)
  }
}
