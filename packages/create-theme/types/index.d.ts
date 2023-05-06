import type { Variable } from '@tamagui/web';
export type ThemeMask = Record<string, string | number>;
export type Palette = (string | Variable)[];
export type MaskOptions = {
    palette?: Palette;
    override?: Partial<ThemeMask>;
    skip?: Partial<ThemeMask>;
    strength?: number;
    max?: number;
    min?: number;
};
type GenericTheme = {
    [key: string]: string | Variable;
};
export type CreateMask = <A extends ThemeMask>(template: A, options: MaskOptions) => A;
export declare function createTheme<Definition extends ThemeMask, Extras extends Record<string, string> = {}>(palette: Palette, definition: Definition, options?: {
    nonInheritedValues?: Extras;
}): {
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
export declare const skipMask: CreateMask;
export declare const createShiftMask: ({ inverse }?: {
    inverse?: boolean | undefined;
}) => CreateMask;
export declare const createWeakenMask: () => CreateMask;
export declare const createStrengthenMask: () => CreateMask;
export declare function applyMask<Theme extends GenericTheme>(theme: Theme, mask: CreateMask, options?: MaskOptions): Theme;
export {};
//# sourceMappingURL=index.d.ts.map