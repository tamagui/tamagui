import { stylePropsAll } from '@tamagui/helpers';
import type { Shorthands } from '../types';
type StringKey<Props> = Extract<keyof Props, string>;
type Simplify<Value> = {
    [Key in keyof Value]: Value[Key];
};
type ExpandedShorthandKey<Key extends PropertyKey, ShorthandMap extends object = Shorthands> = Key extends keyof ShorthandMap ? ShorthandMap[Key] extends PropertyKey ? ShorthandMap[Key] : Key : Key;
type ShorthandKeysMatchingFilter<Filter extends object, ShorthandMap extends object = Shorthands> = {
    [Key in keyof ShorthandMap]-?: ShorthandMap[Key] extends keyof Filter ? Key : never;
}[keyof ShorthandMap];
type KeysMatchingFilter<Filter extends object, ShorthandMap extends object = Shorthands> = keyof Filter | ShorthandKeysMatchingFilter<Filter, ShorthandMap>;
type StyleKeys = KeysMatchingFilter<typeof stylePropsAll>;
type ExpandedProps<Props extends object, Keys extends keyof Props, ShorthandMap extends object> = Simplify<{
    [Key in Extract<Keys, keyof ShorthandMap> as ExpandedShorthandKey<Key, ShorthandMap>]: Props[Key];
} & Omit<Pick<Props, Keys>, keyof ShorthandMap>>;
type SelectedProps<Props extends object, Keys extends keyof Props, ExpandShorthands extends boolean, ShorthandMap extends object = Shorthands> = ExpandShorthands extends true ? ExpandedProps<Props, Keys, ShorthandMap> : Pick<Props, Keys>;
export type SplitStylePropsResult<Props extends object, Keys extends PropertyKey, ExpandShorthands extends boolean = false, ShorthandMap extends object = Shorthands> = [
    SelectedProps<Props, Extract<keyof Props, Keys>, ExpandShorthands, ShorthandMap>,
    Omit<Props, Keys>
];
export type SplitStylePropsFilterCallback<Props extends object> = (key: string, value: Props[StringKey<Props>], originalKey: StringKey<Props>, isStyleProp: boolean) => boolean;
export type SplitStylePropsFilter<Props extends object> = Readonly<Record<string, unknown>> | SplitStylePropsFilterCallback<Props>;
export type SplitStylePropsOptions<Props extends object> = {
    expandShorthands?: boolean;
    filter?: SplitStylePropsFilter<Props>;
};
/** partitions authored props in one pass without resolving style values */
export declare function splitStyleProps<Props extends object, const ExpandShorthands extends boolean = false>(props: Props, options?: {
    expandShorthands?: ExpandShorthands;
}): SplitStylePropsResult<Props, StyleKeys, ExpandShorthands>;
export declare function splitStyleProps<Props extends object, const Filter extends Readonly<Record<string, unknown>>, const ExpandShorthands extends boolean = false>(props: Props, options: {
    expandShorthands?: ExpandShorthands;
    filter: Filter;
}): SplitStylePropsResult<Props, KeysMatchingFilter<Filter>, ExpandShorthands>;
export declare function splitStyleProps<Props extends object, SelectedKey extends StringKey<Props>, const ExpandShorthands extends boolean = false>(props: Props, options: {
    expandShorthands?: ExpandShorthands;
    filter: (key: string, value: Props[StringKey<Props>], originalKey: StringKey<Props>, isStyleProp: boolean) => originalKey is SelectedKey;
}): SplitStylePropsResult<Props, SelectedKey, ExpandShorthands>;
export declare function splitStyleProps<Props extends object, const ExpandShorthands extends boolean = false>(props: Props, options: {
    expandShorthands?: ExpandShorthands;
    filter: SplitStylePropsFilterCallback<Props>;
}): [Partial<SelectedProps<Props, keyof Props, ExpandShorthands>>, Partial<Props>];
export {};
//# sourceMappingURL=splitStyleProps.d.ts.map