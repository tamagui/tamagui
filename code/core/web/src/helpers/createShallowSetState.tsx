import type React from 'react'
import type { DebugProp } from '../types'
import { startTransition, useCallback } from 'react'

const callImmediate = (cb) => cb()

export function createShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  onlyAllow?: string[],
  transition?: boolean,
  debug?: DebugProp,
  callback?: (nextState: any) => void
) {
  // this must be memoized or it ruins performance in components
  return useCallback(
    (next?: Partial<State>) => {
      const wrap = transition ? startTransition : callImmediate
      wrap(() => {
        setter((prev) => {
          const out = mergeIfNotShallowEqual(prev, next, onlyAllow, debug)
          callback?.(out)
          return out
        })
      })
    },
    [setter, onlyAllow ? onlyAllow.join('') : '', transition, debug]
  )
}

export function mergeIfNotShallowEqual(
  prev: any,
  next: any,
  onlyAllow?: string[],
  debug?: DebugProp
) {
  if (onlyAllow) {
    let allowed = {}
    for (const key in next) {
      if (onlyAllow.includes(key)) {
        allowed[key] = next[key]
      }
    }
    next = allowed
  }
  if (!prev || !next || isEqualShallow(prev, next)) {
    if (!prev) return next
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
