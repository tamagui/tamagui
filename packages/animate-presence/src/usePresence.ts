import { useId } from '@react-aria/utils'
import { useContext, useEffect } from 'react'

import { AnimatePresenceContext, AnimatePresenceContextProps } from './AnimatePresenceContext'

export type SafeToRemove = () => void

type AlwaysPresent = [true, null]
type Present = [true]
type NotPresent = [false, SafeToRemove]

export function usePresence(): AlwaysPresent | Present | NotPresent {
  const context = useContext(AnimatePresenceContext)

  console.log('context', context)

  if (context === null) {
    return [true, null]
  }

  const { isPresent, onExitComplete, register } = context

  // It's safe to call the following hooks conditionally (after an early return) because the context will always
  // either be null or non-null for the lifespan of the component.

  // Replace with useId when released in React
  const id = useId()

  useEffect(() => {
    console.log('registering')
    register(id)
  }, [])

  const safeToRemove = () => onExitComplete?.(id)

  return !isPresent && onExitComplete ? [false, safeToRemove] : [true]
}

/**
 * Similar to `usePresence`, except `useIsPresent` simply returns whether or not the component is present.
 * There is no `safeToRemove` function. ```
 */
export function useIsPresent() {
  return isPresent(useContext(AnimatePresenceContext))
}

export function isPresent(context: AnimatePresenceContextProps | null) {
  return context === null ? true : context.isPresent
}
