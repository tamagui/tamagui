/**
 * TurboModule spec for native style registry.
 * This file is used by React Native's codegen to generate
 * native bindings for iOS and Android.
 */
import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    /**
     * Install JSI bindings for direct ref access (synchronous).
     * Call this early to enable __tamaguiLinkView global function.
     * Returns true if bindings were installed, false otherwise.
     */
    installBindings(): boolean;
    /**
     * Link a view by its native tag with pre-computed theme styles.
     * NOTE: This is the legacy method - prefer using __tamaguiLinkView for
     * full ShadowNodeFamily support (styles persist through reconciliation).
     */
    link(tag: number, stylesJson: string, scopeId?: string | null): void;
    /**
     * Unlink a view when it unmounts.
     */
    unlink(tag: number): void;
    /**
     * Set the global theme.
     * Updates all linked views via UIManager.updateShadowTree().
     */
    setTheme(themeName: string): void;
    /**
     * Set theme for a specific scope.
     * Only views linked with this scopeId will be updated.
     */
    setScopedTheme(scopeId: string, themeName: string): void;
    /**
     * Get current theme name (synchronous).
     */
    getTheme(): string;
    /**
     * Get registry statistics (synchronous).
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