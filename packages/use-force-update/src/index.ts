import { useReducer } from 'react'

export const isServerSide = process.env.TAMAGUI_TARGET === 'web' && typeof window === 'undefined'

const idFn = () => {}

export function useForceUpdate() {
  return isServerSide ? idFn : (useReducer((x) => x + 1, 0)[1] as () => void)
}
