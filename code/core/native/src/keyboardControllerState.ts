const GLOBAL_KEY = '__tamagui_native_keyboard_controller_state__'

export interface KeyboardControllerState {
  enabled: boolean
  KeyboardProvider: any
  KeyboardAwareScrollView: any
  useKeyboardHandler: any
  useReanimatedKeyboardAnimation: any
  KeyboardController: any
  KeyboardEvents: any
  KeyboardStickyView: any
}

function getGlobalState(): KeyboardControllerState {
  const g = globalThis as any
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      enabled: false,
      KeyboardProvider: null,
      KeyboardAwareScrollView: null,
      useKeyboardHandler: null,
      useReanimatedKeyboardAnimation: null,
      KeyboardController: null,
      KeyboardEvents: null,
      KeyboardStickyView: null,
    }
  }
  return g[GLOBAL_KEY]
}

export function isKeyboardControllerEnabled(): boolean {
  return getGlobalState().enabled
}

export function getKeyboardControllerState(): KeyboardControllerState {
  return getGlobalState()
}

export function setKeyboardControllerState(
  updates: Partial<KeyboardControllerState>
): void {
  const state = getGlobalState()
  Object.assign(state, updates)
}
