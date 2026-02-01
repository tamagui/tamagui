import type { ThemeStyleMap, ViewRef, RegistryStats } from './types';
export type { ThemeStyleMap, ViewRef, RegistryStats } from './types';
/**
 * Get the ShadowNode from a React ref.
 * This accesses React Native internals - the same approach Unistyles uses.
 */
declare function getShadowNodeFromRef(ref: any): any;
/**
 * Register a view with the style registry.
 * The native module will track this view and update its styles when the theme changes.
 *
 * @param viewRef - React ref to the native view
 * @param styles - Pre-computed styles for each theme
 * @param scopeId - Optional scope ID for nested themes
 * @returns View ID for unregistration
 */
export declare function registerView(viewRef: ViewRef, styles: ThemeStyleMap, scopeId?: string): string;
/**
 * Link a view ref directly with its styles.
 * This is the preferred approach for native module - it extracts the ShadowNode
 * from the ref and registers it directly with the native registry.
 *
 * @param ref - The actual ref instance (not the ref object)
 * @param styles - Pre-computed styles for each theme
 * @returns cleanup function to unlink on unmount
 */
export declare function link(ref: any, styles: ThemeStyleMap): () => void;
export { getShadowNodeFromRef };
/**
 * Set the native tag for a registered view.
 * This links the JS registration to the actual native view.
 * Call this after the view mounts and you have access to the native tag.
 *
 * @param viewId - View ID returned from registerView
 * @param tag - Native view tag from findNodeHandle or similar
 */
export declare function setNativeTag(viewId: string, tag: number): void;
/**
 * Unregister a view from the style registry.
 * Call this when the view unmounts.
 *
 * @param viewId - View ID returned from registerView
 */
export declare function unregisterView(viewId: string): void;
/**
 * Set the current theme globally.
 * This triggers an update on all registered views WITHOUT causing React re-renders.
 *
 * @param themeName - The theme name (e.g., 'light', 'dark', 'dark_blue')
 */
export declare function setTheme(themeName: string): void;
/**
 * Set the theme for a specific scope.
 * Only views registered to this scope will be updated.
 *
 * @param scopeId - The scope ID
 * @param themeName - The theme name
 */
export declare function setThemeForScope(scopeId: string, themeName: string): void;
/**
 * Create a new theme scope for nested themes.
 * Views registered to this scope will inherit from the parent scope.
 *
 * @param name - Scope name (e.g., 'blue', 'active')
 * @param parentScopeId - Optional parent scope for nesting
 * @returns Scope ID
 */
export declare function createScope(name: string, parentScopeId?: string): string;
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
//# sourceMappingURL=index.d.ts.map