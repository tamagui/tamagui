import type { ViewStyle, TextStyle } from 'react-native';
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
export interface NativeStyleRegistryModule {
    register(viewId: string, stylesJson: string, scopeId?: string): void;
    unregister(viewId: string): void;
    setTheme(themeName: string): void;
    setThemeForScope(scopeId: string, themeName: string): void;
    createScope(name: string, parentScopeId?: string): string;
    getStats(): RegistryStats;
}
//# sourceMappingURL=types.d.ts.map