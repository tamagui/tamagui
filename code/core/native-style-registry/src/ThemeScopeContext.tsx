/**
 * Context for passing theme scope IDs down the component tree.
 * Each <Theme> component creates a unique scope ID that child components
 * use when registering with the native style registry.
 */

import { createContext, useContext, useId, useLayoutEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

// late-bind to avoid circular imports
let _setScopedTheme: ((scopeId: string, themeName: string) => void) | null = null
let _removeScopedTheme: ((scopeId: string) => void) | null = null
let _isNativeModuleAvailable: (() => boolean) | null = null

export function __bindRegistryFunctions(
  setScopedTheme: (scopeId: string, themeName: string) => void,
  removeScopedTheme: (scopeId: string) => void,
  isNativeModuleAvailable: () => boolean
) {
  _setScopedTheme = setScopedTheme
  _removeScopedTheme = removeScopedTheme
  _isNativeModuleAvailable = isNativeModuleAvailable
}

// scope ID is a string for React's useId
interface ThemeScopeContextValue {
  scopeId: string
  parentScopeId?: string
}

export const ThemeScopeContext = createContext<ThemeScopeContextValue | null>(null)

export function useThemeScopeId(): string | undefined {
  const ctx = useContext(ThemeScopeContext)
  return ctx?.scopeId
}

/**
 * Provides a new theme scope for child components.
 * Called by the Theme component to create a scope that can be targeted
 * by setThemeForScope() for zero-re-render theme updates.
 */
export function ThemeScopeProvider({
  themeName,
  children,
}: {
  themeName: string
  children: ReactNode
}) {
  const scopeId = useId()
  const parentCtx = useContext(ThemeScopeContext)

  // signal theme change to native registry
  // scopes are created implicitly when views link with a scopeId
  useLayoutEffect(() => {
    if (_isNativeModuleAvailable?.()) {
      _setScopedTheme?.(scopeId, themeName)
      return () => _removeScopedTheme?.(scopeId)
    }
  }, [scopeId, themeName])

  const value = useMemo(
    () => ({
      scopeId,
      parentScopeId: parentCtx?.scopeId,
    }),
    [scopeId, parentCtx?.scopeId]
  )

  return <ThemeScopeContext.Provider value={value}>{children}</ThemeScopeContext.Provider>
}
