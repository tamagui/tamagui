import type { StyledContext, StyledContextOptions } from '../types';
type EmptyDefault = Record<PropertyKey, never>;
type EmptyDefaultOptions = string | {
    namespace?: string;
    keys?: never;
};
type StyledContextKey<Props> = Extract<keyof Props, string>;
type OptionalStyledContextKeys<Props extends Record<string, any>> = {
    [Key in keyof Props]-?: {} extends Pick<Props, Key> ? Key : never;
}[keyof Props];
type RequiredStyledContextKeys<Props extends Record<string, any>> = Exclude<keyof Props, OptionalStyledContextKeys<Props>>;
type FullDefaultValues<Props extends Record<string, any>> = {
    [Key in RequiredStyledContextKeys<Props>]: Props[Key];
} & {
    [Key in OptionalStyledContextKeys<Props>]: Props[Key] | undefined;
};
type StyledContextFactory = {
    <VariantProps extends Record<string, any>, ConsumedKeys extends StyledContextKey<VariantProps>>(defaultValues: VariantProps, namespaceOrOptions: StyledContextOptions<VariantProps, ConsumedKeys> & {
        keys: readonly ConsumedKeys[];
    }): StyledContext<VariantProps, ConsumedKeys>;
    <VariantProps extends Record<string, any>>(defaultValues: EmptyDefault, namespaceOrOptions?: EmptyDefaultOptions): StyledContext<VariantProps, never>;
    <VariantProps extends Record<string, any>>(defaultValues: VariantProps & FullDefaultValues<VariantProps>, namespaceOrOptions?: EmptyDefaultOptions): StyledContext<VariantProps, StyledContextKey<VariantProps>>;
    <VariantProps extends Record<string, any>, ConsumedKeys extends StyledContextKey<VariantProps>>(defaultValues: undefined, namespaceOrOptions: StyledContextOptions<VariantProps, ConsumedKeys> & {
        keys: readonly ConsumedKeys[];
    }): StyledContext<VariantProps, ConsumedKeys>;
    <VariantProps extends Record<string, any> = Record<string, any>>(defaultValues?: undefined, namespaceOrOptions?: string): StyledContext<VariantProps, never>;
};
export declare const createStyledContext: StyledContextFactory;
export {};
//# sourceMappingURL=createStyledContext.d.ts.map