import type { PresenceContextProps, UsePresenceResult } from '@tamagui/web'
import { useContext, useEffect } from 'react'

import { PresenceContext } from './PresenceContext'

export function usePresence(): UsePresenceResult {
  const context = useContext(PresenceContext)

  if (!context) {
    return [true, null, context]
  }

  const { id, isPresent, onExitComplete, register } = context

  useEffect(() => register(id), [])

  const safeToRemove = () => onExitComplete?.(id)

  return !isPresent && onExitComplete
    ? [false, safeToRemove, context]
    : [true, undefined, context]
}

/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 */
export function useIsPresent() {
  return isPresent(useContext(PresenceContext))
}

export function isPresent(context: PresenceContextProps | null) {
  return context === null ? true : context.isPresent
}
