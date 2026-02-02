import type { ViewStyle, TextStyle, TurboModule } from 'react-native'

export type StyleValue = ViewStyle | TextStyle

export type DeduplicatedStyle = StyleValue & {
  // array of theme names that share this style (for deduplication)
  __themes?: string[]
}

export interface ThemeStyleMap {
  [themeName: string]: DeduplicatedStyle
}

export interface ViewRef {
  current: any
}

export interface RegistryStats {
  viewCount: number
  scopeCount: number
  currentTheme: string
}

/**
 * ShadowNode extracted from React Native internals.
 * Obtained via ref.__internalInstanceHandle?.stateNode?.node
 */
export type ShadowNode = unknown

/**
 * Style object mapping theme names to resolved styles.
 * Same as __styles prop from compiler.
 */
export type Unistyle = Record<string, DeduplicatedStyle>

export interface NativeStyleRegistryModule extends TurboModule {
  installBindings(): boolean
  link(tag: number, stylesJson: string, scopeId?: string | null): void
  unlink(tag: number): void
  setTheme(themeName: string): void
  setScopedTheme(scopeId: string, themeName: string): void
  getTheme(): string
  getStats(): RegistryStats
}

/**
 * Global JSI function installed by native module.
 * Allows passing refs directly for ShadowNodeFamily extraction.
 */
declare global {
  var __tamaguiLinkView: ((ref: any, stylesJson: string, scopeId?: string) => void) | undefined
}
