const GLOBAL_KEY = '__tamagui_native_gesture_state__'

export interface GestureState {
  enabled: boolean
  Gesture: any
  GestureDetector: any
  ScrollView: any
}

function getGlobalState(): GestureState {
  const g = globalThis as any
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      enabled: false,
      Gesture: null,
      GestureDetector: null,
      ScrollView: null,
    }
  }
  return g[GLOBAL_KEY]
}

export function isGestureHandlerEnabled(): boolean {
  return getGlobalState().enabled
}

export function getGestureHandlerState(): GestureState {
  return getGlobalState()
}

export function setGestureHandlerState(updates: Partial<GestureState>): void {
  const state = getGlobalState()
  Object.assign(state, updates)
}
