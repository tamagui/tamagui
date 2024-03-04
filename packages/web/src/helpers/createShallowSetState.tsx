import type React from 'react'
import type { DebugProp } from '../types'

export function createShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  isDisabled?: boolean,
  debug?: DebugProp
) {
  return (next?: Partial<State>) =>
    setter((prev) => mergeIfNotShallowEqual(prev, next, isDisabled, debug))
}

export function mergeIfNotShallowEqual(
  prev: any,
  next: any,
  isDisabled?: boolean,
  debug?: DebugProp
) {
  if (isDisabled || !prev || !next || isEqualShallow(prev, next)) {
    if (!prev) return next
    return prev
  }
  if (process.env.NODE_ENV === 'development') {
    if (debug) {
      console.warn(`setStateShallow CHANGE`, { prev, next })
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
