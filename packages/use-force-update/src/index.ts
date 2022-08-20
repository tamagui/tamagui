import { useReducer } from 'react'

export const isServerSide = process.env.TAMAGUI_TARGET === 'web' && typeof window === 'undefined'

export function useForceUpdate() {
  if (isServerSide) {
    return () => {}
  }
  return useReducer((x) => x + 1, 0)[1] as () => void
}
