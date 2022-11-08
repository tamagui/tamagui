import React, { useCallback } from 'react'

export function useShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  debug?: boolean | 'verbose',
  debugName?: string
) {
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        for (const key in next) {
          if (prev[key] !== next[key]) {
            if (process.env.NODE_ENV === 'development') {
              if (debug === 'verbose') {
                // eslint-disable-next-line no-console
                console.warn(`update ${debugName}`, next)
              }
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
