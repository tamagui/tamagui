/**
 * TurboModule spec for native style registry.
 * This file is used by React Native's codegen to generate
 * native bindings for iOS and Android.
 */
import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    /**
     * Register a view with pre-computed theme styles.
     */
    register(viewId: string, stylesJson: string, scopeId?: string): void;
    /**
     * Set the native tag for a registered view.
     * Called after the view mounts to link JS registration to native view.
     */
    setNativeTag(viewId: string, tag: number): void;
    /**
     * Unregister a view when it unmounts.
     */
    unregister(viewId: string): void;
    /**
     * Set the global theme.
     */
    setTheme(themeName: string): void;
    /**
     * Set theme for a specific scope.
     */
    setThemeForScope(scopeId: string, themeName: string): void;
    /**
     * Create a new theme scope.
     */
    createScope(name: string, parentScopeId?: string): string;
    /**
     * Get registry statistics.
     */
    getStats(): {
        viewCount: number;
        scopeCount: number;
        currentTheme: string;
    };
}
declare const _default: Spec | null;
export default _default;
//# sourceMappingURL=NativeTamaguiStyleRegistry.d.ts.map