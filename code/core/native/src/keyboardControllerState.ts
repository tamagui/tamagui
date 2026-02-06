import { createGlobalState } from './globalState'
import type { KeyboardControllerState } from './types'

export type { KeyboardControllerState }

const state = createGlobalState<KeyboardControllerState>(`keyboard_controller`, {
  enabled: false,
  KeyboardProvider: null,
  KeyboardAwareScrollView: null,
  useKeyboardHandler: null,
  useReanimatedKeyboardAnimation: null,
  KeyboardController: null,
  KeyboardEvents: null,
  KeyboardStickyView: null,
})

export function isKeyboardControllerEnabled(): boolean {
  return state.get().enabled
}

export function getKeyboardControllerState(): KeyboardControllerState {
  return state.get()
}

export function setKeyboardControllerState(
  updates: Partial<KeyboardControllerState>
): void {
  Object.assign(state.get(), updates)
}
