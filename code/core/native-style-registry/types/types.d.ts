import type { ViewStyle, TextStyle, TurboModule } from 'react-native';
export type StyleValue = ViewStyle | TextStyle;
export type DeduplicatedStyle = StyleValue & {
    __themes?: string[];
};
export interface ThemeStyleMap {
    [themeName: string]: DeduplicatedStyle;
}
export interface ViewRef {
    current: any;
}
export interface RegistryStats {
    viewCount: number;
    scopeCount: number;
    currentTheme: string;
}
/**
 * ShadowNode extracted from React Native internals.
 * Obtained via ref.__internalInstanceHandle?.stateNode?.node
 */
export type ShadowNode = unknown;
/**
 * Style object mapping theme names to resolved styles.
 * Same as __styles prop from compiler.
 */
export type Unistyle = Record<string, DeduplicatedStyle>;
export interface NativeStyleRegistryModule extends TurboModule {
    link(tag: number, stylesJson: string, scopeId?: string | null): void;
    unlink(tag: number): void;
    setTheme(themeName: string): void;
    setScopedTheme(scopeId: string, themeName: string): void;
    getTheme(): string;
    getStats(): RegistryStats;
}
//# sourceMappingURL=types.d.ts.map