import type { LinearGradientState } from './types'

const GLOBAL_KEY = '__tamagui_linear_gradient_state__'

type TamaguiGlobal = typeof globalThis & {
  [GLOBAL_KEY]?: LinearGradientState
}

// reset on module load so reloadReactNative gets a clean state
// (globalThis persists across reloads but module scope re-evaluates)
;(globalThis as TamaguiGlobal)[GLOBAL_KEY] = { enabled: false, Component: null }

function getGlobalState(): LinearGradientState {
  const g = globalThis as TamaguiGlobal
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { enabled: false, Component: null }
  }
  return g[GLOBAL_KEY]
}

function setGlobalState(newState: LinearGradientState): void {
  ;(globalThis as TamaguiGlobal)[GLOBAL_KEY] = newState
}

export interface LinearGradientAccessor {
  readonly isEnabled: boolean
  readonly state: LinearGradientState
  set(newState: LinearGradientState): void
}

export function getLinearGradient(): LinearGradientAccessor {
  return {
    get isEnabled(): boolean {
      return getGlobalState().enabled
    },
    get state(): LinearGradientState {
      return getGlobalState()
    },
    set(newState: LinearGradientState): void {
      setGlobalState(newState)
    },
  }
}
