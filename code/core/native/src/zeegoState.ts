import { createGlobalState } from './globalState'
import type { ZeegoState } from './types'

const state = createGlobalState<ZeegoState>(`zeego`, {
  enabled: false,
  DropdownMenu: null,
  ContextMenu: null,
})

export interface ZeegoAccessor {
  readonly isEnabled: boolean
  readonly state: ZeegoState
  set(newState: ZeegoState): void
}

export function getZeego(): ZeegoAccessor {
  return {
    get isEnabled(): boolean {
      return state.get().enabled
    },
    get state(): ZeegoState {
      return state.get()
    },
    set(newState: ZeegoState): void {
      state.set(newState)
    },
  }
}
