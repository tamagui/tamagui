import type {
  PresenceContextProps,
  PresenceRegistration,
  UsePresenceResult,
} from '@tamagui/web'
import * as React from 'react'

import { PresenceContext } from './PresenceContext'

export function usePresence(registration?: PresenceRegistration): UsePresenceResult {
  const context = React.useContext(PresenceContext)

  // the style pass completes later in the same render. read its registration
  // decision in the passive effect so every component calls this hook in a
  // fixed position, while only frames that animate join presence bookkeeping.
  React.useEffect(() => {
    if (context && registration?.shouldRegisterPresence) {
      return context.register(context.id)
    }
  })

  if (!context) return [true, null, context]

  const { id, isPresent, onExitComplete } = context

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
