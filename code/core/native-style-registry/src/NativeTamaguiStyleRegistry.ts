/**
 * TurboModule spec for native style registry.
 * This file is used by React Native's codegen to generate
 * native bindings for iOS and Android.
 */

import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  /**
   * Link a view by its native tag with pre-computed theme styles.
   * The native module will track this view and update its styles on theme change.
   */
  link(tag: number, stylesJson: string, scopeId?: string | null): void

  /**
   * Unlink a view when it unmounts.
   */
  unlink(tag: number): void

  /**
   * Set the global theme.
   * Updates all linked views via UIManager.updateShadowTree().
   */
  setTheme(themeName: string): void

  /**
   * Set theme for a specific scope.
   * Only views linked with this scopeId will be updated.
   */
  setScopedTheme(scopeId: string, themeName: string): void

  /**
   * Get current theme name (synchronous).
   */
  getTheme(): string

  /**
   * Get registry statistics (synchronous).
   */
  getStats(): {
    viewCount: number
    scopeCount: number
    currentTheme: string
  }
}

export default TurboModuleRegistry.get<Spec>('TamaguiStyleRegistry')
