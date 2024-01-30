import type { StyledContext } from './helpers/createStyledContext';
import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetStaticConfig, GetStyledVariants, GetTokenPropsFromAcceptedTokens, GetVariantValues, InferStyledProps, StaticConfigPublic, StylableComponent, TamaDefer, TamaguiComponent, VariantDefinitions, VariantSpreadFunction } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends Object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
export declare function styled<ParentComponent extends StylableComponent, StyledStaticConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledStaticConfig>>(ComponentIn: ParentComponent, options?: Partial<InferStyledProps<ParentComponent, StyledStaticConfig>> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    acceptsClassName?: boolean;
}, staticExtractionOptions?: StyledStaticConfig): TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, StyledStaticConfig["acceptTokens"] extends Record<string, any> ? GetBaseStyles<ParentComponent, StyledStaticConfig> & GetTokenPropsFromAcceptedTokens<StyledStaticConfig["acceptTokens"]> : GetBaseStyles<ParentComponent, StyledStaticConfig>, AreVariantsUndefined<Variants> extends true ? GetStyledVariants<ParentComponent> : AreVariantsUndefined<GetStyledVariants<ParentComponent>> extends true ? Omit<AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>, "_isEmpty"> : { [Key in Exclude<keyof GetStyledVariants<ParentComponent>, "_isEmpty"> | Exclude<keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>), "_isEmpty">]?: (Key extends keyof GetStyledVariants<ParentComponent> ? GetStyledVariants<ParentComponent>[Key] : undefined) | (Key extends keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>) ? (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>)[Key] : undefined) | undefined; }, GetStaticConfig<ParentComponent, StyledStaticConfig>>;
export {};
//# sourceMappingURL=styled.d.ts.map