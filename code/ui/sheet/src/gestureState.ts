/**
 * Re-export gesture state from @tamagui/native.
 * Sheet uses this for backward compatibility with existing code.
 */

import { getGestureHandler, type GestureState } from '@tamagui/native'

export type { GestureState as GestureHandlerState } from '@tamagui/native'

// backward compat helpers
export function isGestureHandlerEnabled(): boolean {
  return getGestureHandler().isEnabled
}

export function getGestureHandlerState(): GestureState {
  return getGestureHandler().state
}

export function setGestureHandlerState(updates: Partial<GestureState>): void {
  getGestureHandler().set(updates)
}

// alias for backward compatibility
export const setGestureState = setGestureHandlerState
