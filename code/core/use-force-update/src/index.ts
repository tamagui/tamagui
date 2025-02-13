import React from 'react'

export const isServerSide: boolean =
  process.env.TAMAGUI_TARGET === 'web' && typeof window === 'undefined'

const idFn = () => {}

export function useForceUpdate(): () => void {
  return isServerSide
    ? idFn
    : (React.useReducer((x) => Math.random(), 0)[1] as () => void)
}
