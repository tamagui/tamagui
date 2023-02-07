import type { Variable } from '@tamagui/web';
type GenericTheme = {
    [key: string]: string | Variable;
};
export type ThemeMask = Record<string, string | number>;
export type Palette = string[];
type CreateMask = <A extends ThemeMask>(template: A) => A;
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
export type ShiftMaskProps = {
    by: number;
    max: number;
    min?: number;
};
export declare const weakenMask: ({ by, max, min, inverse, }: ShiftMaskProps & {
    inverse?: boolean | undefined;
}) => CreateMask;
export declare const strengthenMask: (props: ShiftMaskProps) => CreateMask;
export declare function applyMask<Theme extends GenericTheme>(theme: Theme, mask: CreateMask): Theme;
export {};
//# sourceMappingURL=index.d.ts.map