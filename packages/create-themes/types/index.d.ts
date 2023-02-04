import { Variable } from '@tamagui/core';
export * from './createThemes';
type ThemeMask = Record<string, number | string>;
type Palette = string[];
type GenericTheme = {
    [key: string]: string | Variable;
};
export declare function createThemeFromPalette<Definition extends ThemeMask>(palette: Palette, definition: Definition): {
    [key in keyof Definition]: string;
};
export declare function extendTheme<Theme extends GenericTheme>(theme: Theme, mask: ThemeMask): Theme;
//# sourceMappingURL=index.d.ts.map