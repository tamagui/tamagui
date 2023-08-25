import React from 'react'

import { TamaguiComponentState } from '../types'

export function createShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>
) {
  return (next: Partial<State>) => setter((prev) => mergeIfNotShallowEqual(prev, next))
}

export function mergeIfNotShallowEqual(prev, next) {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return { ...prev, ...next }
    }
  }
  return prev
}
