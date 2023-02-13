import type { Variable } from '@tamagui/web';
export type ThemeMask = Record<string, string | number>;
export type Palette = string[];
export type ShiftMaskProps = {
    by: number;
    max: number;
    min?: number;
};
export type MaskOptions = {
    skip?: Partial<ThemeMask>;
};
type GenericTheme = {
    [key: string]: string | Variable;
};
type CreateMask = <A extends ThemeMask>(template: A, options: MaskOptions) => A;
export declare function createTheme<Definition extends ThemeMask, Extras extends Record<string, string> = {}>(palette: Palette, definition: Definition, options?: {
    nonInheritedValues?: Extras;
}): {
    [key in keyof Definition | keyof Extras]: string;
};
type SubThemeKeys<ParentKeys, ChildKeys> = `${ParentKeys extends string ? ParentKeys : never}_${ChildKeys extends string ? ChildKeys : never}`;
export declare function addChildren<Theme extends GenericTheme, Themes extends {
    [key: string]: Theme;
}, GetChildren extends (name: keyof Themes, theme: Theme) => {
    [key: string]: Theme;
}>(themes: Themes, getChildren: GetChildren): Themes & {
    [key in SubThemeKeys<keyof Themes, keyof ReturnType<GetChildren>>]: Theme;
};
export declare const createWeakenMask: ({ by, max, min, inverseNegatives, }: ShiftMaskProps & {
    inverseNegatives?: boolean | undefined;
}) => CreateMask;
export declare const createStrengthenMask: (props: ShiftMaskProps) => CreateMask;
export declare function applyMask<Theme extends GenericTheme>(theme: Theme, mask: CreateMask, options?: MaskOptions): Theme;
export {};
//# sourceMappingURL=index.d.ts.map