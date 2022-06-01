import { useId } from '@tamagui/core'
import { useContext, useEffect } from 'react'

import { AnimatePresenceContext, AnimatePresenceContextProps } from './AnimatePresenceContext'

export type SafeToRemove = () => void

export function useEntering(): [boolean | undefined, undefined | (() => void)] {
  const context = useContext(AnimatePresenceContext)

  if (context === null) {
    return [undefined, undefined]
  }

  const { isEntering, onExitComplete, register } = context
  const id = useId() || ''
  const safeToRemove = () => onExitComplete?.(id)

  // It's safe to call the following hooks conditionally (after an early return) because the context will always
  // either be null or non-null for the lifespan of the component.

  useEffect(() => {
    register(id)
  }, [])

  return isEntering === false
    ? [false, safeToRemove]
    : isEntering === true
    ? [true, safeToRemove]
    : [undefined, safeToRemove]
}

/**
 * Similar to `useEntering`, except `useIsEntering` simply returns whether or not the component is present.
 * There is no `safeToRemove` function. ```
 */
export function useIsEntering() {
  return isEntering(useContext(AnimatePresenceContext))
}

export function isEntering(context: AnimatePresenceContextProps | null) {
  return context === null ? undefined : context.isEntering
}
