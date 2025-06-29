import { useCallback } from 'react'

type DebugProp = null | undefined | boolean | 'profile' | 'verbose' | 'break'

export type CallbackSetState<State> = (next: (cb: State) => State) => void

export function useCreateShallowSetState<State extends Record<string, unknown>>(
  setter: CallbackSetState<State>,
  debugIn?: DebugProp
): (next: Partial<State>) => void {
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
): State {
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

export function isEqualShallow(prev: Object, next: Object): boolean {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return false
    }
  }
  return true
}
