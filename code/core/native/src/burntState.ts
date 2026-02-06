import { createGlobalState } from './globalState'
import type { BurntState } from './types'

const state = createGlobalState<BurntState>(`burnt`, {
  enabled: false,
  toast: null,
  dismissAllAlerts: null,
})

export interface BurntAccessor {
  readonly isEnabled: boolean
  readonly state: BurntState
  set(newState: BurntState): void
}

export function getBurnt(): BurntAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): BurntState {
      return state.get()
    },
    set(newState: BurntState): void {
      state.set(newState)
    },
  }
}
