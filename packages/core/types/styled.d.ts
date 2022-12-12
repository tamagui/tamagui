import { GetProps, GetVariantValues, MediaProps, PseudoProps, StaticConfig, StylableComponent, TamaguiComponent, TamaguiElement, VariantDefinitions, VariantSpreadFunction } from './types';
export type StyledOptions<ParentComponent extends StylableComponent> = GetProps<ParentComponent> & {
    name?: string;
    variants?: VariantDefinitions<ParentComponent> | undefined;
    defaultVariants?: {
        [key: string]: any;
    };
};
type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, infer P> ? P : GetProps<A>;
type GetVariantProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, any, infer V> ? V : {};
export declare function styled<ParentComponent extends StylableComponent, Variants extends VariantDefinitions<ParentComponent> | void = VariantDefinitions<ParentComponent> | void>(Component: ParentComponent, options?: GetProps<ParentComponent> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: {
        [key: string]: any;
    };
    acceptsClassName?: boolean;
}, staticExtractionOptions?: Partial<StaticConfig>): TamaguiComponent<Variants extends void ? GetProps<ParentComponent> : GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })> & (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; }) & MediaProps<Partial<GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })> & (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })>> & PseudoProps<Partial<GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })> & (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })>>, TamaguiElement, GetBaseProps<ParentComponent>, GetVariantProps<ParentComponent> & (Variants extends void ? {} : { [Key in keyof Variants]?: (Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>) | undefined; })>;
export {};
//# sourceMappingURL=styled.d.ts.map