import type {
  PresenceContextProps,
  PresenceRegistration,
  UsePresenceResult,
} from '@tamagui/web'
import * as React from 'react'

import { PresenceContext } from './PresenceContext'

export function usePresence(registration?: PresenceRegistration): UsePresenceResult {
  const context = React.useContext(PresenceContext)

  // the style pass completes later in the same render, so the registration
  // decision is read in a passive effect: every component calls this hook in a
  // fixed position while only frames that animate join presence bookkeeping.
  // Registration is sticky — it happens once and unregisters only at unmount,
  // never between commits (a mid-exit unregister completes the exit instantly
  // and the exit animation never plays). A public caller with no registration
  // handle keeps the always-register contract.
  const unregister = React.useRef<undefined | void | (() => void)>(undefined)
  React.useEffect(() => {
    if (
      !unregister.current &&
      context &&
      (registration ? registration.shouldRegisterPresence : true)
    ) {
      unregister.current = context.register(context.id)
    }
  })
  React.useEffect(
    () => () => {
      if (typeof unregister.current === 'function') unregister.current()
      unregister.current = undefined
    },
    []
  )

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
