/**
 * Web/test fallback — JS-only registry (no native module).
 * Provides the same API surface so consumers don't need platform checks.
 */
import type { ThemeStyleMap, RegistryStats } from './types';
export type { ThemeStyleMap, RegistryStats } from './types';
export { ThemeScopeContext, ThemeScopeProvider, useThemeScopeId, } from './ThemeScopeContext';
export { useInitialThemeName } from './useInitialThemeName';
export { View } from './components/View';
export { Text } from './components/Text';
export declare function link(_ref: unknown, _styles: ThemeStyleMap, _scopeId?: string): () => void;
export declare function setTheme(themeName: string): void;
export declare function getTheme(): string;
export declare function setScopedTheme(_scopeId: string, _themeName: string): void;
export declare function removeScopedTheme(_scopeId: string): void;
export declare function isNativeModuleAvailable(): boolean;
export declare function getRegistryStats(): RegistryStats;
export declare function resetRegistry(): void;
//# sourceMappingURL=index.d.ts.map