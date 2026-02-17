/**
 * Hook that reads the current theme name ONCE without subscribing to changes.
 * Used by optimized components that rely on native registry for theme updates.
 *
 * This is intentionally "wrong" from React's perspective - it doesn't subscribe
 * to context changes. But that's the point: the native registry handles updates
 * directly on the ShadowTree, bypassing React entirely.
 *
 * IMPORTANT: This hook does NOT use useContext because that would subscribe
 * to context changes. Instead, we read directly from Tamagui's internal state.
 */

import { useRef } from 'react'

// get the root theme state function - this reads from a global without subscribing
let getRootThemeState: (() => { name: string } | null) | null = null

try {
  const core = require('@tamagui/core')
  getRootThemeState = core.getRootThemeState
} catch {
  // @tamagui/core not available, will fall back to 'light'
}

/**
 * Get the initial theme name without subscribing to updates.
 * Returns the theme name at the time of first render.
 *
 * WARNING: This hook intentionally does NOT subscribe to theme changes.
 * The component will NOT re-render when the theme changes.
 * This is the desired behavior for optimized components that use
 * native ShadowTree updates instead of React re-renders.
 *
 * @returns Theme name string (e.g., 'light', 'dark', 'dark_blue')
 */
export function useInitialThemeName(): string {
  const cachedRef = useRef<string | null>(null)

  // only compute once - after initial render, always return cached value
  if (cachedRef.current !== null) {
    return cachedRef.current
  }

  let themeName = 'light' // fallback

  if (getRootThemeState) {
    // read the theme state directly from global state - NO SUBSCRIPTION
    const rootState = getRootThemeState()
    if (rootState?.name) {
      themeName = rootState.name
    }
  }

  cachedRef.current = themeName
  return themeName
}
