import { createGlobalState } from './globalState'
import type { LinearGradientState } from './types'

const state = createGlobalState<LinearGradientState>(`linear_gradient`, {
  enabled: false,
  Component: null,
})

export interface LinearGradientAccessor {
  readonly isEnabled: boolean
  readonly state: LinearGradientState
  set(newState: LinearGradientState): void
}

export function getLinearGradient(): LinearGradientAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): LinearGradientState {
      return state.get()
    },
    set(newState: LinearGradientState): void {
      state.set(newState)
    },
  }
}
