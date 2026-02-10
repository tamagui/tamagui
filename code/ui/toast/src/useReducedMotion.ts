/**
 * Hook to detect reduced motion preference.
 * Returns true if user prefers reduced motion (via system settings or forced).
 */

import { isWeb } from '@tamagui/constants'
import * as React from 'react'

let cachedResult: boolean | null = null

function getReducedMotion(): boolean {
  if (cachedResult !== null) return cachedResult

  if (!isWeb) {
    // on native, we could use AccessibilityInfo.isReduceMotionEnabled()
    // but that requires async, so default to false
    cachedResult = false
    return false
  }

  if (typeof window === 'undefined') {
    return false
  }

  cachedResult = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  return cachedResult
}

export function useReducedMotion(forceReducedMotion?: boolean): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(
    () => forceReducedMotion ?? getReducedMotion()
  )

  React.useEffect(() => {
    // if forced, use that value
    if (forceReducedMotion !== undefined) {
      setReducedMotion(forceReducedMotion)
      return
    }

    // listen for changes to system preference
    if (!isWeb || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mediaQuery) return

    const handleChange = (e: MediaQueryListEvent) => {
      cachedResult = e.matches
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener?.('change', handleChange)
    return () => {
      mediaQuery.removeEventListener?.('change', handleChange)
    }
  }, [forceReducedMotion])

  return reducedMotion
}
