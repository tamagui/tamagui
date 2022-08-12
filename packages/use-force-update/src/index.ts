import { useReducer } from 'react'

export function useForceUpdate() {
  // RSC
  if (typeof document === 'undefined') {
    return () => {}
  }
  return useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)[1]
}
