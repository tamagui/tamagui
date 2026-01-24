import type { GestureState } from './types'

const GLOBAL_KEY = '__tamagui_native_gesture_state__'

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

export interface GestureHandlerAccessor {
  readonly isEnabled: boolean
  readonly state: GestureState
  set(updates: Partial<GestureState>): void
}

export function getGestureHandler(): GestureHandlerAccessor {
  return {
    get isEnabled(): boolean {
      return getGlobalState().enabled
    },
    get state(): GestureState {
      return getGlobalState()
    },
    set(updates: Partial<GestureState>): void {
      const state = getGlobalState()
      Object.assign(state, updates)
    },
  }
}
