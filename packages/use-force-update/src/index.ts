import { useReducer } from 'react'

export function useForceUpdate() {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)
  return forceUpdate
}
