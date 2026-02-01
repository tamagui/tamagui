// allow overriding for tests
let _findNodeHandle: ((ref: any) => number | null) | undefined
let _NativeModules: any

// try to load react-native (will fail in test env)
try {
  const rn = require('react-native')
  _NativeModules = rn.NativeModules
  _findNodeHandle = rn.findNodeHandle
} catch {
  // running in test environment without react-native
  _NativeModules = {}
}

// internal setters for testing
export function __setFindNodeHandle(fn: typeof _findNodeHandle) {
  _findNodeHandle = fn
}
export function __setNativeModules(modules: any) {
  _NativeModules = modules
}

import type {
  ThemeStyleMap,
  ViewRef,
  RegistryStats,
  NativeStyleRegistryModule,
} from './types'

export type { ThemeStyleMap, ViewRef, RegistryStats } from './types'

// re-export context components
export {
  ThemeScopeContext,
  ThemeScopeProvider,
  useThemeScopeId,
} from './ThemeScopeContext'
import { __bindRegistryFunctions } from './ThemeScopeContext'

// re-export initial theme name hook
export { useInitialThemeName } from './useInitialThemeName'

// get the native module (evaluated lazily to allow test injection)
function getNativeRegistry(): NativeStyleRegistryModule | undefined {
  return _NativeModules?.TamaguiStyleRegistry
}

/**
 * Get the native tag from a React ref.
 * Uses React Native's findNodeHandle which is the official API.
 */
function getTagFromRef(ref: any): number | null {
  if (!_findNodeHandle) return null
  try {
    return _findNodeHandle(ref)
  } catch {
    return null
  }
}

// fallback for when native module is not available (JS-only mode)
let jsViewRegistry = new Map<number, { styles: ThemeStyleMap; scopeId?: string }>()
let jsCurrentTheme = 'light'

/**
 * Link a view ref directly with its styles.
 * Uses findNodeHandle to get the native tag, then registers with native module.
 *
 * @param ref - The actual ref instance (not the ref object)
 * @param styles - Pre-computed styles for each theme
 * @param scopeId - Optional scope ID for nested themes (from ThemeScopeContext)
 * @returns cleanup function to unlink on unmount
 */
export function link(ref: any, styles: ThemeStyleMap, scopeId?: string): () => void {
  if (!ref || !styles) {
    return () => {}
  }

  const tag = getTagFromRef(ref)

  const registry = getNativeRegistry()
  if (registry && tag !== null) {
    // use native module for zero-re-render updates
    registry.link(tag, JSON.stringify(styles), scopeId ?? null)
    return () => {
      // re-get tag in case ref changed (shouldn't but be safe)
      const unlinkTag = getTagFromRef(ref) ?? tag
      registry.unlink(unlinkTag)
    }
  }

  // JS fallback - store by tag
  if (tag !== null) {
    jsViewRegistry.set(tag, { styles, scopeId })
    return () => {
      jsViewRegistry.delete(tag)
    }
  }

  return () => {}
}

export { getTagFromRef }

/**
 * Set the current theme globally.
 * This triggers an update on all linked views WITHOUT causing React re-renders.
 *
 * @param themeName - The theme name (e.g., 'light', 'dark', 'dark_blue')
 */
export function setTheme(themeName: string): void {
  const registry = getNativeRegistry()
  if (registry) {
    registry.setTheme(themeName)
  } else {
    jsCurrentTheme = themeName
    // in JS fallback, we would need to force update all views
    // this is NOT zero-re-render, but provides a fallback
  }
}

/**
 * Get the current theme name.
 */
export function getTheme(): string {
  const registry = getNativeRegistry()
  if (registry) {
    return registry.getTheme()
  }
  return jsCurrentTheme
}

/**
 * Set the theme for a specific scope.
 * Only views linked with this scopeId will be updated.
 *
 * @param scopeId - The scope ID
 * @param themeName - The theme name
 */
export function setScopedTheme(scopeId: string, themeName: string): void {
  const registry = getNativeRegistry()
  if (registry) {
    registry.setScopedTheme(scopeId, themeName)
  } else {
    // JS fallback - would need to update views in scope
  }
}

/**
 * Get current registry statistics.
 * Useful for debugging and monitoring.
 */
export function getRegistryStats(): RegistryStats {
  const registry = getNativeRegistry()
  if (registry) {
    return registry.getStats()
  } else {
    return {
      viewCount: jsViewRegistry.size,
      scopeCount: 0,
      currentTheme: jsCurrentTheme,
    }
  }
}

/**
 * Check if native module is available.
 * When false, the registry operates in JS-only mode (with re-renders).
 */
export function isNativeModuleAvailable(): boolean {
  return !!getNativeRegistry()
}

/**
 * Reset the registry (for testing purposes).
 */
export function resetRegistry(): void {
  jsViewRegistry = new Map()
  jsCurrentTheme = 'light'
}

// bind functions to ThemeScopeContext to avoid circular imports
__bindRegistryFunctions(setScopedTheme, isNativeModuleAvailable)
