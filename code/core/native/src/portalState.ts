export type NativePortalState = {
  enabled: boolean
  type: 'teleport' | 'legacy' | null
}

let state: NativePortalState = { enabled: false, type: null }

export function setNativePortalState(newState: NativePortalState) {
  state = newState
}

export function getNativePortalState(): NativePortalState {
  return state
}
// retrigger ci
