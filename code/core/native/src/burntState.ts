import type { BurntState } from './types'

let state: BurntState = { enabled: false, toast: null, dismissAllAlerts: null }

export interface BurntAccessor {
  readonly isEnabled: boolean
  readonly state: BurntState
  set(newState: BurntState): void
}

export function getBurnt(): BurntAccessor {
  return {
    get isEnabled(): boolean {
      return state.enabled
    },
    get state(): BurntState {
      return state
    },
    set(newState: BurntState): void {
      state = newState
    },
  }
}
