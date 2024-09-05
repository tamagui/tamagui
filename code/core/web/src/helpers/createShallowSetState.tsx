import type React from 'react'
import type { DebugProp } from '../types'
import { startTransition } from 'react'

const callImmediate = (cb) => cb()

export function createShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>,
  isDisabled?: boolean,
  transition?: boolean,
  debug?: DebugProp
) {
  return (next?: Partial<State>) => {
    const wrap = transition ? startTransition : callImmediate
    wrap(() => {
      setter((prev) => mergeIfNotShallowEqual(prev, next, isDisabled, debug))
    })
  }
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
