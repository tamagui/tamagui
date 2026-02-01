import type { HybridObject } from 'react-native-nitro-modules';
import type { ShadowNode, Unistyle } from '../types';
/**
 * Native interface for the Tamagui Style Registry.
 * Provides zero-re-render theme switching via ShadowTree manipulation.
 */
export interface TamaguiShadowRegistry extends HybridObject<{
    ios: 'c++';
    android: 'c++';
}> {
    /**
     * Link a ShadowNode to the registry with its styles.
     * Called when a component mounts.
     */
    link(node: ShadowNode, styles: Unistyle): void;
    /**
     * Unlink a ShadowNode from the registry.
     * Called when a component unmounts.
     */
    unlink(node: ShadowNode): void;
    /**
     * Set the current theme.
     * All linked views will be updated via ShadowTree.
     */
    setTheme(themeName: string): void;
    /**
     * Get the current theme name.
     */
    getTheme(): string | undefined;
    /**
     * Set theme for a specific scope (nested Theme component).
     */
    setScopedTheme(scopeId: number, themeName: string): void;
    /**
     * Get theme for a specific scope.
     */
    getScopedTheme(scopeId: number): string | undefined;
    /**
     * Flush pending updates to ShadowTree.
     * Batches all style updates for performance.
     */
    flush(): void;
}
//# sourceMappingURL=ShadowRegistry.nitro.d.ts.map