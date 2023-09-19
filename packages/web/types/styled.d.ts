import { StyledContext } from './helpers/createStyledContext';
import type { GetRef } from './interfaces/GetRef';
import type { GetProps, GetVariantValues, MediaProps, PseudoProps, StaticConfig, StylableComponent, TamaguiComponent, VariantDefinitions, VariantSpreadFunction } from './types';
type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, infer P> ? P : GetProps<A>;
type GetVariantProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, any, infer V> ? V : {};
type GetVariantAcceptedValues<V> = V extends Object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
export declare function styled<ParentComponent extends StylableComponent, Variants extends VariantDefinitions<ParentComponent> | void = VariantDefinitions<ParentComponent> | void>(ComponentIn: ParentComponent, options?: GetProps<ParentComponent> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    acceptsClassName?: boolean;
}, staticExtractionOptions?: Partial<StaticConfig>): TamaguiComponent<Variants extends void ? GetProps<ParentComponent> : GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)> & (Variants extends void ? {} : GetVariantAcceptedValues<Variants>) & PseudoProps<Partial<GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)> & (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)>> & MediaProps<Partial<GetBaseProps<ParentComponent> & Omit<GetVariantProps<ParentComponent>, keyof (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)> & (Variants extends void ? {} : GetVariantAcceptedValues<Variants>)>>, GetRef<ParentComponent>, GetBaseProps<ParentComponent>, GetVariantProps<ParentComponent> & (Variants extends void ? {} : GetVariantAcceptedValues<Variants>), { [Key in Exclude<keyof ParentComponent, "defaultProps" | "propTypes" | "staticConfig" | "extractable" | "styleable" | "$$typeof">]: ParentComponent[Key]; }>;
export {};
//# sourceMappingURL=styled.d.ts.map