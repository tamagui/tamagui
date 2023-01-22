import React, { startTransition, useCallback } from 'react'

import { DebugProp } from '../types'

export function useShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  transition?: boolean,
  debug?: DebugProp,
  debugName?: string
) {
  return useCallback(
    (next: Partial<State>) => {
      const run = () => {
        setter((prev) => {
          for (const key in next) {
            if (prev[key] !== next[key]) {
              if (process.env.NODE_ENV === 'development') {
                if (debug === 'verbose') {
                  // eslint-disable-next-line no-console
                  console.log(` ▲ setState ${debugName}`, next)
                }
              }
              return { ...prev, ...next }
            }
          }
          return prev
        })
      }
      if (transition) {
        startTransition(() => {
          run()
        })
      } else {
        run()
      }
    },
    [setter]
  )
}
