import { useCallback } from 'react'
import type { DebugProp } from '../types'

export type CallbackSetState<State> = (next: (cb: State) => State) => void

export function useCreateShallowSetState<State extends Record<string, unknown>>(
  setter: CallbackSetState<State>,
  debugIn?: DebugProp
) {
  // this must be memoized or it ruins performance in components
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        return mergeIfNotShallowEqual(prev, next, debugIn)
      })
    },
    [setter, debugIn]
  )
}

export function mergeIfNotShallowEqual<State extends Record<string, unknown>>(
  prev: State,
  next: Partial<State>,
  debug?: DebugProp
) {
  if (!prev || !next || isEqualShallow(prev, next)) {
    if (!prev) return next as State
    return prev
  }
  if (process.env.NODE_ENV === 'development') {
    if (debug) {
      console.info(`setStateShallow CHANGE`, { prev, next })
      if (debug === 'break') {
        // biome-ignore lint/suspicious/noDebugger: <explanation>
        debugger
      }
    }
  }
  return { ...prev, ...next }
}

export function isEqualShallow(prev, next) {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return false
    }
  }
  return true
}
