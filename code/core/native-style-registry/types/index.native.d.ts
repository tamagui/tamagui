import type { ThemeStyleMap, RegistryStats } from './types';
export type { ThemeStyleMap, ViewRef, RegistryStats } from './types';
export { ThemeScopeContext, ThemeScopeProvider, useThemeScopeId, } from './ThemeScopeContext';
export { useInitialThemeName } from './useInitialThemeName';
/**
 * Get the native tag from a React ref.
 * Uses React Native's findNodeHandle which is the official API.
 */
export declare function getTagFromRef(ref: any): number | null;
/**
 * Link a view ref directly with its styles.
 * Uses JSI function (__tamaguiLinkView) when available for ShadowNodeFamily persistence,
 * falls back to tag-based registration.
 *
 * @param ref - The actual ref instance (not the ref object)
 * @param styles - Pre-computed styles for each theme
 * @param scopeId - Optional scope ID for nested themes (from ThemeScopeContext)
 * @returns cleanup function to unlink on unmount
 */
export declare function link(ref: any, styles: ThemeStyleMap, scopeId?: string): () => void;
/**
 * Set the current theme globally.
 * This triggers an update on all linked views WITHOUT causing React re-renders.
 *
 * @param themeName - The theme name (e.g., 'light', 'dark', 'dark_blue')
 */
export declare function setTheme(themeName: string): void;
/**
 * Get the current theme name.
 */
export declare function getTheme(): string;
/**
 * Set the theme for a specific scope.
 * Only views linked with this scopeId will be updated.
 *
 * @param scopeId - The scope ID
 * @param themeName - The theme name
 */
export declare function setScopedTheme(scopeId: string, themeName: string): void;
/**
 * Get current registry statistics.
 * Useful for debugging and monitoring.
 */
export declare function getRegistryStats(): RegistryStats;
/**
 * Check if native module is available.
 * When false, the registry operates in JS-only mode (with re-renders).
 */
export declare function isNativeModuleAvailable(): boolean;
/**
 * Reset the registry (for testing purposes).
 */
export declare function resetRegistry(): void;
//# sourceMappingURL=index.native.d.ts.map