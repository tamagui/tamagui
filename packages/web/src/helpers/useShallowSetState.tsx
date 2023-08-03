import React from 'react'

import { TamaguiComponentState } from '../types'

export function useShallowSetState<State extends TamaguiComponentState>(
  setter: React.Dispatch<React.SetStateAction<State>>
) {
  return (next: Partial<State>) => setter((prev) => shallow(prev, next))
}

function shallow(prev, next) {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return { ...prev, ...next }
    }
  }
  return prev
}
