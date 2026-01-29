import type { LinearGradientState } from './types'

let state: LinearGradientState = { enabled: false, Component: null }

export interface LinearGradientAccessor {
  readonly isEnabled: boolean
  readonly state: LinearGradientState
  set(newState: LinearGradientState): void
}

export function getLinearGradient(): LinearGradientAccessor {
  return {
    get isEnabled(): boolean {
      return state.enabled
    },
    get state(): LinearGradientState {
      return state
    },
    set(newState: LinearGradientState): void {
      state = newState
    },
  }
}
