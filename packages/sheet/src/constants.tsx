import { isClient } from '@tamagui/core'
import { Dimensions } from 'react-native'

export const constants = {}

export const SHEET_NAME = 'Sheet'
export const SHEET_HANDLE_NAME = 'SheetHandle'
export const SHEET_OVERLAY_NAME = 'SheetOverlay'

// set all the way off screen
// + 0.1 ensures this is unique - see hasntMeasured ref
const screen = Dimensions.get('screen')
export const HIDDEN_SIZE = Math.max(screen.height, screen.width) + 0.1

export const SHEET_HIDDEN_STYLESHEET = isClient ? document.createElement('style') : null
if (SHEET_HIDDEN_STYLESHEET) {
  document.head.appendChild(SHEET_HIDDEN_STYLESHEET)
}
