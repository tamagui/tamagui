import type { NativePortalState } from './types'

const GLOBAL_KEY = '__tamagui_native_portal_state__'

type TamaguiGlobal = typeof globalThis & {
  [GLOBAL_KEY]?: NativePortalState
}

// reset on module load so reloadReactNative gets a clean state
// (globalThis persists across reloads but module scope re-evaluates)
;(globalThis as TamaguiGlobal)[GLOBAL_KEY] = { enabled: false, type: null }

function getGlobalState(): NativePortalState {
  const g = globalThis as TamaguiGlobal
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { enabled: false, type: null }
  }
  return g[GLOBAL_KEY]
}

export interface PortalAccessor {
  readonly isEnabled: boolean
  readonly state: NativePortalState
  set(newState: NativePortalState): void
}

export function getPortal(): PortalAccessor {
  return {
    get isEnabled(): boolean {
      return getGlobalState().enabled
    },
    get state(): NativePortalState {
      return getGlobalState()
    },
    set(newState: NativePortalState): void {
      const g = globalThis as TamaguiGlobal
      g[GLOBAL_KEY] = newState
    },
  }
}
