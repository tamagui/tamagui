import type { ThemeStyleMap, RegistryStats } from './types';
export type { ThemeStyleMap, RegistryStats } from './types';
export { ThemeScopeContext, ThemeScopeProvider, useThemeScopeId, } from './ThemeScopeContext';
export { useInitialThemeName } from './useInitialThemeName';
export { View } from './components/View';
export { Text } from './components/Text';
/**
 * Link a view with its pre-computed theme styles.
 * The C++ side stores the ShadowNodeFamily and styles,
 * then applies the correct theme's styles directly on the ShadowTree.
 */
export declare function link(ref: unknown, styles: ThemeStyleMap, scopeId?: string): () => void;
/**
 * Set the current theme globally.
 * Updates all linked views via ShadowTree — zero React re-renders.
 */
export declare function setTheme(themeName: string): void;
/**
 * Get the current theme name.
 */
export declare function getTheme(): string;
/**
 * Set the theme for a specific scope.
 * Only views linked with this scopeId will be updated.
 */
export declare function setScopedTheme(scopeId: string, themeName: string): void;
/**
 * Remove a scope entry (cleanup on <Theme> unmount).
 */
export declare function removeScopedTheme(scopeId: string): void;
/**
 * Check if native module is available.
 */
export declare function isNativeModuleAvailable(): boolean;
/**
 * Get current registry statistics.
 */
export declare function getRegistryStats(): RegistryStats;
/**
 * Reset the registry (for testing).
 */
export declare function resetRegistry(): void;
//# sourceMappingURL=index.native.d.ts.map