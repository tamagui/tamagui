import { CreateThemePalette, GenericTheme, ThemeMask } from './types';
export type ThemeInfo = {
    palette: CreateThemePalette;
    definition: ThemeMask;
    cache: Map<any, any>;
};
export declare const getThemeInfo: (theme: GenericTheme | ThemeMask) => ThemeInfo | undefined;
export declare const setThemeInfo: (theme: GenericTheme | ThemeMask, info: Pick<ThemeInfo, 'palette' | 'definition'>) => void;
//# sourceMappingURL=themeInfo.d.ts.map