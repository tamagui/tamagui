import type { Variable } from '@tamagui/web';
export type types = {};
export type Palette = (string | Variable)[];
export type ThemeMask = Record<string, string | number>;
export type MaskOptions = {
    palette?: Palette;
    override?: Partial<ThemeMask>;
    skip?: Partial<ThemeMask>;
    strength?: number;
    max?: number;
    min?: number;
};
export type GenericTheme = {
    [key: string]: string | Variable;
};
export type CreateMask = <A extends ThemeMask>(template: A, options: MaskOptions) => A;
//# sourceMappingURL=Palette.d.ts.map