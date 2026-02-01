// conditional import for react-native to allow testing
let NativeModules: any
try {
  const rn = require('react-native')
  NativeModules = rn.NativeModules
} catch {
  // running in test environment without react-native
  NativeModules = {}
}

import type {
  ThemeStyleMap,
  ViewRef,
  RegistryStats,
  NativeStyleRegistryModule,
} from './types'

export type { ThemeStyleMap, ViewRef, RegistryStats } from './types'

// get the native module
const NativeRegistry: NativeStyleRegistryModule | undefined =
  NativeModules.TamaguiStyleRegistry

/**
 * Get the ShadowNode from a React ref.
 * This accesses React Native internals - the same approach Unistyles uses.
 */
function getShadowNodeFromRef(ref: any): any {
  return (
    ref?.__internalInstanceHandle?.stateNode?.node ??
    ref?.getScrollResponder?.()?.getNativeScrollRef?.()?.__internalInstanceHandle?.stateNode?.node ??
    ref?.getNativeScrollRef?.()?.__internalInstanceHandle?.stateNode?.node ??
    ref?._viewRef?.__internalInstanceHandle?.stateNode?.node ??
    ref?.viewRef?.current?.__internalInstanceHandle?.stateNode?.node ??
    ref?._nativeRef?.__internalInstanceHandle?.stateNode?.node ??
    null
  )
}

// fallback for when native module is not available (JS-only mode)
let jsViewRegistry = new Map<string, { ref: ViewRef; styles: ThemeStyleMap; scopeId?: string }>()
let jsScopeRegistry = new Map<string, { name: string; parentId?: string }>()
let jsCurrentTheme = 'light'
let jsIdCounter = 0

const GLOBAL_SCOPE_ID = '__global__'

// ensure global scope exists
jsScopeRegistry.set(GLOBAL_SCOPE_ID, { name: 'global' })

function generateId(): string {
  return `view_${++jsIdCounter}`
}

/**
 * Register a view with the style registry.
 * The native module will track this view and update its styles when the theme changes.
 *
 * @param viewRef - React ref to the native view
 * @param styles - Pre-computed styles for each theme
 * @param scopeId - Optional scope ID for nested themes
 * @returns View ID for unregistration
 */
export function registerView(
  viewRef: ViewRef,
  styles: ThemeStyleMap,
  scopeId?: string
): string {
  const viewId = generateId()

  if (NativeRegistry) {
    // use native module for zero-re-render updates
    NativeRegistry.register(viewId, JSON.stringify(styles), scopeId)
  } else {
    // JS fallback
    jsViewRegistry.set(viewId, { ref: viewRef, styles, scopeId })
  }

  return viewId
}

/**
 * Link a view ref directly with its styles.
 * This is the preferred approach for native module - it extracts the ShadowNode
 * from the ref and registers it directly with the native registry.
 *
 * @param ref - The actual ref instance (not the ref object)
 * @param styles - Pre-computed styles for each theme
 * @returns cleanup function to unlink on unmount
 */
export function link(ref: any, styles: ThemeStyleMap): () => void {
  if (!ref || !styles) {
    return () => {}
  }

  if (NativeRegistry && 'link' in NativeRegistry) {
    // get ShadowNode from ref using React Native internals
    const shadowNode = getShadowNodeFromRef(ref)
    if (shadowNode) {
      ;(NativeRegistry as any).link(shadowNode, JSON.stringify(styles))
      return () => {
        const node = getShadowNodeFromRef(ref)
        if (node) {
          ;(NativeRegistry as any).unlink(node)
        }
      }
    }
  }

  // JS fallback - store by viewId
  const viewId = generateId()
  jsViewRegistry.set(viewId, { ref: { current: ref }, styles })
  return () => {
    jsViewRegistry.delete(viewId)
  }
}

export { getShadowNodeFromRef }

/**
 * Set the native tag for a registered view.
 * This links the JS registration to the actual native view.
 * Call this after the view mounts and you have access to the native tag.
 *
 * @param viewId - View ID returned from registerView
 * @param tag - Native view tag from findNodeHandle or similar
 */
export function setNativeTag(viewId: string, tag: number): void {
  if (NativeRegistry && 'setNativeTag' in NativeRegistry) {
    ;(NativeRegistry as any).setNativeTag(viewId, tag)
  }
  // in JS fallback, we don't need the native tag
}

/**
 * Unregister a view from the style registry.
 * Call this when the view unmounts.
 *
 * @param viewId - View ID returned from registerView
 */
export function unregisterView(viewId: string): void {
  if (NativeRegistry) {
    NativeRegistry.unregister(viewId)
  } else {
    jsViewRegistry.delete(viewId)
  }
}

/**
 * Set the current theme globally.
 * This triggers an update on all registered views WITHOUT causing React re-renders.
 *
 * @param themeName - The theme name (e.g., 'light', 'dark', 'dark_blue')
 */
export function setTheme(themeName: string): void {
  if (NativeRegistry) {
    NativeRegistry.setTheme(themeName)
  } else {
    jsCurrentTheme = themeName
    // in JS fallback, we would need to force update all views
    // this is NOT zero-re-render, but provides a fallback
  }
}

/**
 * Set the theme for a specific scope.
 * Only views registered to this scope will be updated.
 *
 * @param scopeId - The scope ID
 * @param themeName - The theme name
 */
export function setThemeForScope(scopeId: string, themeName: string): void {
  if (NativeRegistry) {
    NativeRegistry.setThemeForScope(scopeId, themeName)
  } else {
    // JS fallback - update views in scope
  }
}

/**
 * Create a new theme scope for nested themes.
 * Views registered to this scope will inherit from the parent scope.
 *
 * @param name - Scope name (e.g., 'blue', 'active')
 * @param parentScopeId - Optional parent scope for nesting
 * @returns Scope ID
 */
export function createScope(name: string, parentScopeId?: string): string {
  if (NativeRegistry) {
    return NativeRegistry.createScope(name, parentScopeId)
  } else {
    const scopeId = `scope_${++jsIdCounter}`
    jsScopeRegistry.set(scopeId, { name, parentId: parentScopeId })
    return scopeId
  }
}

/**
 * Get current registry statistics.
 * Useful for debugging and monitoring.
 */
export function getRegistryStats(): RegistryStats {
  if (NativeRegistry) {
    return NativeRegistry.getStats()
  } else {
    return {
      viewCount: jsViewRegistry.size,
      scopeCount: jsScopeRegistry.size,
      currentTheme: jsCurrentTheme,
    }
  }
}

/**
 * Check if native module is available.
 * When false, the registry operates in JS-only mode (with re-renders).
 */
export function isNativeModuleAvailable(): boolean {
  return !!NativeRegistry
}

/**
 * Reset the registry (for testing purposes).
 */
export function resetRegistry(): void {
  jsViewRegistry = new Map()
  jsScopeRegistry = new Map()
  jsScopeRegistry.set(GLOBAL_SCOPE_ID, { name: 'global' })
  jsCurrentTheme = 'light'
  jsIdCounter = 0
}
