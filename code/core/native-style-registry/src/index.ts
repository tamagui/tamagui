/**
 * Web/test fallback — JS-only registry (no native module).
 * Provides the same API surface so consumers don't need platform checks.
 */
import type { ThemeStyleMap, RegistryStats } from './types'

export type { ThemeStyleMap, RegistryStats } from './types'

export {
  ThemeScopeContext,
  ThemeScopeProvider,
  useThemeScopeId,
} from './ThemeScopeContext'
import { __bindRegistryFunctions } from './ThemeScopeContext'

export { useInitialThemeName } from './useInitialThemeName'

export { View } from './components/View'
export { Text } from './components/Text'

let jsCurrentTheme = 'light'

export function link(
  _ref: unknown,
  _styles: ThemeStyleMap,
  _scopeId?: string
): () => void {
  return () => {}
}

export function setTheme(themeName: string): void {
  jsCurrentTheme = themeName
}

export function getTheme(): string {
  return jsCurrentTheme
}

export function setScopedTheme(_scopeId: string, _themeName: string): void {}

export function removeScopedTheme(_scopeId: string): void {}

export function isNativeModuleAvailable(): boolean {
  return false
}

export function getRegistryStats(): RegistryStats {
  return {
    viewCount: 0,
    scopeCount: 0,
    currentTheme: jsCurrentTheme,
  }
}

export function resetRegistry(): void {
  jsCurrentTheme = 'light'
}

__bindRegistryFunctions(setScopedTheme, removeScopedTheme, isNativeModuleAvailable)
