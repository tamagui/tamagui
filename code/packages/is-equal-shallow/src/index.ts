import { useCallback } from 'react'

type DebugProp = null | undefined | boolean | 'profile' | 'verbose' | 'break'

export type CallbackSetState<State> = (next: (cb: State) => State) => void

export function useCreateShallowSetState<State extends Record<string, unknown>>(
  setter: CallbackSetState<State>,
  debug?: DebugProp
): (next: Partial<State>) => void {
  // this must be memoized or it ruins performance in components
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        const update = mergeIfNotShallowEqual(prev, next)
        if (process.env.NODE_ENV === 'development') {
          if (debug && update !== prev) {
            console.groupCollapsed(`setStateShallow CHANGE`, prev, '=>', update)
            console.trace()
            console.groupEnd()
            if (debug === 'break') {
              // biome-ignore lint/suspicious/noDebugger: <explanation>
              debugger
            }
          }
        }
        return update
      })
    },
    [setter, debug]
  )
}

export function mergeIfNotShallowEqual<State extends Record<string, unknown>>(
  prev: State,
  next: Partial<State>
): State {
  if (!prev || !next || isEqualShallow(prev, next)) {
    if (!prev) return next as State
    return prev
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
