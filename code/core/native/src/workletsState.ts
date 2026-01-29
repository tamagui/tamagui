import type { WorkletsState } from './types'

const GLOBAL_KEY = '__tamagui_native_worklets_state__'

function getGlobalState(): WorkletsState {
  const g = globalThis as any
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      enabled: false,
      Worklets: null,
      useRunOnJS: null,
      useWorklet: null,
      createWorkletContextValue: null,
    }
  }
  return g[GLOBAL_KEY]
}

export interface WorkletsAccessor {
  readonly isEnabled: boolean
  readonly state: WorkletsState
  set(updates: Partial<WorkletsState>): void
}

export function getWorklets(): WorkletsAccessor {
  return {
    get isEnabled(): boolean {
      return getGlobalState().enabled
    },
    get state(): WorkletsState {
      return getGlobalState()
    },
    set(updates: Partial<WorkletsState>): void {
      const state = getGlobalState()
      Object.assign(state, updates)
    },
  }
}
