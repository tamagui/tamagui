import React from 'react'

export function createShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>
) {
  return (next: Partial<State>) => setter((prev) => mergeIfNotShallowEqual(prev, next))
}

export function mergeIfNotShallowEqual(prev: any, next: any) {
  return isEqualShallow(prev, next) ? prev : { ...prev, ...next }
}

export function isEqualShallow(prev, next) {
  for (const key in next) {
    if (prev[key] !== next[key]) {
      return false
    }
  }
  return true
}
