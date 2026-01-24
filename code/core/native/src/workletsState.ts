const GLOBAL_KEY = '__tamagui_native_worklets_state__'

export interface WorkletsState {
  enabled: boolean
  Worklets: any
  useRunOnJS: any
  useWorklet: any
  createWorkletContextValue: any
}

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

export function isWorkletsEnabled(): boolean {
  return getGlobalState().enabled
}

export function getWorkletsState(): WorkletsState {
  return getGlobalState()
}

export function setWorkletsState(updates: Partial<WorkletsState>): void {
  const state = getGlobalState()
  Object.assign(state, updates)
}
