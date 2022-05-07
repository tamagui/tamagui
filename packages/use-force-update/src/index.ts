import { useReducer } from 'react'

export function useForceUpdate() {
  return useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)[1]
}
