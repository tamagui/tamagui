import type { Variable } from '@tamagui/web';
export type CreateThemePalette = (string | Variable)[];
export type ThemeMask = Record<string, string | number>;
export type MaskOptions = {
    palette?: CreateThemePalette;
    override?: Partial<ThemeMask>;
    skip?: Partial<ThemeMask>;
    strength?: number;
    max?: number;
    min?: number;
    parentName?: string;
};
export type GenericTheme = {
    [key: string]: string | Variable;
};
export type MaskFunction = <A extends ThemeMask>(template: A, options: MaskOptions) => A;
export type CreateMask = {
    name: string;
    mask: MaskFunction;
};
export type CreateThemeOptions = {
    nonInheritedValues?: GenericTheme;
};
//# sourceMappingURL=types.d.ts.map