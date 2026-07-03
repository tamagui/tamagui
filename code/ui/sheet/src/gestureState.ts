/**
 * Re-export gesture state from @tamagui/native.
 * Sheet uses this for backward compatibility with existing code.
 */

import { getGestureHandler, type GestureState } from '@tamagui/native'

export type { GestureState as GestureHandlerState } from '@tamagui/native'

const SHEET_GESTURE_STATE_KEY = '__tamagui_sheet_gesture_state__'

function getSheetGestureHandlerState(): GestureState {
  const g = globalThis as typeof globalThis & {
    [SHEET_GESTURE_STATE_KEY]?: GestureState
  }

  return g[SHEET_GESTURE_STATE_KEY] ?? getGestureHandler().state
}

// backward compat helpers
export function isGestureHandlerEnabled(): boolean {
  return getSheetGestureHandlerState().enabled
}

export function getGestureHandlerState(): GestureState {
  return getSheetGestureHandlerState()
}

export function setGestureHandlerState(updates: Partial<GestureState>): void {
  const g = globalThis as typeof globalThis & {
    [SHEET_GESTURE_STATE_KEY]?: GestureState
  }

  const sheetState = g[SHEET_GESTURE_STATE_KEY]
  if (sheetState) {
    Object.assign(sheetState, updates)
    return
  }

  getGestureHandler().set(updates)
}

// alias for backward compatibility
export const setGestureState = setGestureHandlerState
