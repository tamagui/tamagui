import { StaticConfig } from 'tamagui';
export type Tab = 'colors' | 'themes' | 'icons' | 'fonts' | 'components' | 'screens';
export type Components = {
    [key: string]: {
        staticConfig: StaticConfig;
    };
};
export type Color = {
    hue: number;
    saturation: number;
    lightness: number;
};
export type Curve = {
    id: string;
    name: string;
    type: 'hue' | 'saturation' | 'lightness';
    values: number[];
};
export type Scale = {
    id: string;
    name: string;
    colors: Color[];
    curves: Partial<Record<Curve['type'], string>>;
};
export type Palette = {
    id: string;
    name: string;
    backgroundColor: string;
    scales: Record<string, Scale>;
    curves: Record<string, Curve>;
};
type ThemeKey = string;
type ColorId = string;
export type ThemeCategory = 'scheme' | 'color' | 'shade' | 'component' | 'state';
export type Theme = {
    category: ThemeCategory;
    values: Record<ThemeKey, ColorId>;
};
export type ThemeParsed = Theme & {
    id: string;
    category: ThemeCategory;
    categoryID: string;
};
export type ThemeVal = {
    name: string;
    offset: number;
};
export type DialogTypes = {
    none: {};
    'create-workspace': {};
    'create-theme': CreateThemeDialogProps;
    export: {};
};
export type StudioDialogProps = DialogTypes[keyof DialogTypes];
export type CreateThemeDialogProps = {
    category: ThemeCategory;
};
export type DeepMutable<T> = T extends (infer R)[] ? DeepMutableArray<R> : T extends (...args: infer Args) => infer Result ? (...args: Args) => UnwrapReadonly<Result> : T extends object ? DeepMutableObject<T> : T;
export type DeepMutableArray<T> = T extends ReadonlyArray<infer X> ? DeepMutable<X> : DeepMutable<T>;
export type DeepMutableObject<T> = {
    -readonly [Key in keyof T]: DeepMutable<T[Key]>;
};
type UnwrapReadonly<T> = T extends DeepReadonlyArray<infer X> ? X : T extends DeepReadonlyObject<infer X> ? X : T;
export type DeepReadonly<T> = T extends (infer R)[] ? DeepReadonlyArray<R> : T extends Function ? T : T extends object ? DeepReadonlyObject<T> : T;
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}
export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export {};
//# sourceMappingURL=types.d.ts.map