import type { CreateThemeOptions, CreateThemePalette, GenericTheme, ThemeMask } from './createThemeTypes';
export type ThemeInfo = {
    palette: CreateThemePalette;
    definition: ThemeMask;
    options?: CreateThemeOptions;
    cache: Map<any, any>;
};
export declare const getThemeInfo: (theme: GenericTheme | ThemeMask, name?: string) => ThemeInfo | undefined;
export declare const setThemeInfo: (theme: GenericTheme | ThemeMask, info: Pick<ThemeInfo, "palette" | "definition" | "options"> & {
    name?: string;
}) => void;
//# sourceMappingURL=themeInfo.d.ts.map