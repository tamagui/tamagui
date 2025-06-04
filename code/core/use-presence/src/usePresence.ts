import type { PresenceContextProps, UsePresenceResult } from '@tamagui/web'
import * as React from 'react'

import { PresenceContext } from './PresenceContext'

export function usePresence(): UsePresenceResult {
  const context = React.useContext(PresenceContext)

  if (!context) {
    return [true, null, context]
  }

  const { id, isPresent, onExitComplete, register } = context

  React.useEffect(() => register(id), [])

  const safeToRemove = () => onExitComplete?.(id)

  return !isPresent && onExitComplete
    ? [false, safeToRemove, context]
    : [true, undefined, context]
}

/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function.
 */
export function useIsPresent(): boolean {
  return isPresent(React.useContext(PresenceContext))
}

export function isPresent(context: PresenceContextProps | null): boolean {
  return context === null ? true : context.isPresent
}
