import React from 'react'

import { TamaguiComponentState } from '../types'

export function createShallowUpdate(
  setter: React.Dispatch<React.SetStateAction<TamaguiComponentState>>
) {
  return (next: Partial<TamaguiComponentState>) => {
    setter((prev) => {
      for (const key in next) {
        if (prev[key] !== next[key]) {
          return { ...prev, ...next }
        }
      }
      return prev
    })
  }
}
