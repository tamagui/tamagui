import React, { startTransition, useCallback } from 'react'

import { DebugProp } from '../types'
import { TamaguiComponentState } from '..'

export function useShallowSetState<State extends TamaguiComponentState>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  debug?: DebugProp,
  debugName?: string
) {
  return useCallback(
    (next: Partial<State>) => {
      const shouldTransition = Object.keys(next).every((k) =>
        transitionKeys.has(k as any)
      )
      const run = shouldTransition ? startTransition : (_) => _()
      run(() => {
        setter((prev) => {
          for (const key in next) {
            if (prev[key] !== next[key]) {
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                // eslint-disable-next-line no-console
                console.log(` ▲ setState ${debugName}`, next)
              }
              return { ...prev, ...next }
            }
          }
          return prev
        })
      })
    },
    [setter]
  )
}

const transitionKeys = new Set<keyof TamaguiComponentState>([
  'press',
  'pressIn',
  'focus',
  'unmounted',
])
