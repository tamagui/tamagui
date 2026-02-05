import type { ZeegoState } from './types'

let state: ZeegoState = { enabled: false, DropdownMenu: null, ContextMenu: null }

export interface ZeegoAccessor {
  readonly isEnabled: boolean
  readonly state: ZeegoState
  set(newState: ZeegoState): void
}

export function getZeego(): ZeegoAccessor {
  return {
    get isEnabled(): boolean {
      return state.enabled
    },
    get state(): ZeegoState {
      return state
    },
    set(newState: ZeegoState): void {
      state = newState
    },
  }
}
