import React, { useCallback } from 'react'

import { DebugProp, TamaguiComponentState } from '../types'

export function useShallowSetState<State extends TamaguiComponentState>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  debug?: DebugProp,
  debugName?: string
) {
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        for (const key in next) {
          if (prev[key] !== next[key]) {
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              console.warn(` ▲ setState ${debugName}`, next)
            }
            return { ...prev, ...next }
          }
        }
        return prev
      })
    },
    [setter]
  )
}
