import type { ViewStyle, TextStyle } from 'react-native';
export type StyleValue = ViewStyle | TextStyle;
export interface ThemeStyleMap {
    [themeName: string]: StyleValue;
}
export interface ViewRef {
    current: any;
}
export interface RegistryStats {
    viewCount: number;
    scopeCount: number;
    currentTheme: string;
}
//# sourceMappingURL=types.d.ts.map