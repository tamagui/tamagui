import { useCallback } from 'react'

type DebugProp = null | undefined | boolean | 'profile' | 'verbose' | 'break'

export type CallbackSetState<State> = (next: (cb: State) => State) => void

export function useCreateShallowSetState<State extends Record<string, unknown>>(
  setter: CallbackSetState<State>,
  debug?: DebugProp
): React.Dispatch<React.SetStateAction<Partial<State>>> {
  // this must be memoized or it ruins performance in components
  return useCallback(
    (stateOrGetState) => {
      setter((prev) => {
        const next =
          typeof stateOrGetState === 'function' ? stateOrGetState(prev) : stateOrGetState
        const update = mergeIfNotShallowEqual(prev, next)

        if (process.env.NODE_ENV === 'development') {
          if (debug && update !== prev) {
            console.groupCollapsed(`setStateShallow CHANGE`, '=>', update)
            console.info(`previously`, prev)
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

export function isEqualShallow(
  prev: Record<string, unknown>,
  next: Record<string, unknown>
): boolean {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return false
    }
  }
  return true
}
