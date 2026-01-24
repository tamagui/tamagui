import type { NativePortalState } from './types'

let state: NativePortalState = { enabled: false, type: null }

export interface PortalAccessor {
  readonly isEnabled: boolean
  readonly state: NativePortalState
  set(newState: NativePortalState): void
}

export function getPortal(): PortalAccessor {
  return {
    get isEnabled(): boolean {
      return state.enabled
    },
    get state(): NativePortalState {
      return state
    },
    set(newState: NativePortalState): void {
      state = newState
    },
  }
}
