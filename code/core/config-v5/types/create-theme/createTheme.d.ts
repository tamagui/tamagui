import type { CreateThemeOptions, CreateThemePalette, GenericTheme, ThemeMask } from './createThemeTypes';
export declare function createThemeWithPalettes<Definition extends ThemeMask, Extras extends GenericTheme = {}>(palettes: Record<string, CreateThemePalette>, defaultPalette: string, definition: Definition, options?: CreateThemeOptions, name?: string, skipCache?: boolean): {
    [key in keyof Definition | keyof Extras]: string;
};
export declare function createTheme<Definition extends ThemeMask, Extras extends GenericTheme = {}>(palette: CreateThemePalette, definition: Definition, options?: CreateThemeOptions, name?: string, skipCache?: boolean): {
    [key in keyof Definition | keyof Extras]: string;
};
type SubThemeKeys<ParentKeys, ChildKeys> = `${ParentKeys extends string ? ParentKeys : never}_${ChildKeys extends string ? ChildKeys : never}`;
type ChildGetter<Name extends string | number | symbol, Theme extends GenericTheme> = (name: Name, theme: Theme) => {
    [key: string]: Theme;
};
export declare function addChildren<Themes extends {
    [key: string]: GenericTheme;
}, GetChildren extends ChildGetter<keyof Themes, Themes[keyof Themes]>>(themes: Themes, getChildren: GetChildren): Themes & {
    [key in SubThemeKeys<keyof Themes, keyof ReturnType<GetChildren>>]: Themes[keyof Themes];
};
export {};
//# sourceMappingURL=createTheme.d.ts.map