import { StaticConfig } from 'tamagui';
export declare type Tab = 'colors' | 'themes' | 'icons' | 'fonts' | 'components' | 'screens';
export declare type Components = {
    [key: string]: {
        staticConfig: StaticConfig;
    };
};
export declare type Color = {
    hue: number;
    saturation: number;
    lightness: number;
};
export declare type Curve = {
    id: string;
    name: string;
    type: 'hue' | 'saturation' | 'lightness';
    values: number[];
};
export declare type Scale = {
    id: string;
    name: string;
    colors: Color[];
    curves: Partial<Record<Curve['type'], string>>;
};
export declare type Palette = {
    id: string;
    name: string;
    backgroundColor: string;
    scales: Record<string, Scale>;
    curves: Record<string, Curve>;
};
declare type ThemeKey = string;
declare type ColorId = string;
export declare type ThemeCategory = 'scheme' | 'color' | 'shade' | 'component' | 'state';
export declare type Theme = {
    category: ThemeCategory;
    values: Record<ThemeKey, ColorId>;
};
export declare type ThemeParsed = Theme & {
    id: string;
    category: ThemeCategory;
    categoryID: string;
};
export declare type ThemeVal = {
    name: string;
    offset: number;
};
export declare type DialogTypes = {
    none: {};
    'create-workspace': {};
    'create-theme': CreateThemeDialogProps;
    export: {};
};
export declare type StudioDialogProps = DialogTypes[keyof DialogTypes];
export declare type CreateThemeDialogProps = {
    category: ThemeCategory;
};
export declare type DeepMutable<T> = T extends (infer R)[] ? DeepMutableArray<R> : T extends (...args: infer Args) => infer Result ? (...args: Args) => UnwrapReadonly<Result> : T extends object ? DeepMutableObject<T> : T;
export declare type DeepMutableArray<T> = T extends ReadonlyArray<infer X> ? DeepMutable<X> : DeepMutable<T>;
export declare type DeepMutableObject<T> = {
    -readonly [Key in keyof T]: DeepMutable<T[Key]>;
};
declare type UnwrapReadonly<T> = T extends DeepReadonlyArray<infer X> ? X : T extends DeepReadonlyObject<infer X> ? X : T;
export declare type DeepReadonly<T> = T extends (infer R)[] ? DeepReadonlyArray<R> : T extends Function ? T : T extends object ? DeepReadonlyObject<T> : T;
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}
export declare type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export {};
//# sourceMappingURL=types.d.ts.map