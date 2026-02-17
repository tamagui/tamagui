import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Native interface for the Tamagui Shadow Registry.
 *
 * Provides zero-re-render theme switching by updating
 * the ShadowTree directly from C++ — bypassing React reconciliation.
 *
 * Note: link() and unlink() are registered as raw JSI methods (not here)
 * because they receive opaque ShadowNode pointers that can't be typed
 * through Nitro's type system. See HybridTamaguiShadowRegistry.cpp.
 */
export interface TamaguiShadowRegistry extends HybridObject<{
  ios: 'c++'
  android: 'c++'
}> {
  /**
   * Set the global theme. Updates all linked views via ShadowTree.
   */
  setTheme(themeName: string): void

  /**
   * Set theme for a specific scope (nested <Theme> component).
   * Only views linked with this scopeId will be updated.
   */
  setScopedTheme(scopeId: string, themeName: string): void

  /**
   * Get the current global theme name.
   */
  getTheme(): string

  /**
   * Remove a scope entry (cleanup on <Theme> unmount).
   */
  removeScopedTheme(scopeId: string): void

  /**
   * Debug: number of linked views.
   */
  getViewCount(): number

  /**
   * Debug: number of active scopes.
   */
  getScopeCount(): number
}
