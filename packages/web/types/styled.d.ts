import { StyledContext } from './helpers/createStyledContext';
import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetProps, GetStaticConfig, GetStyledVariants, GetVariantValues, StaticConfigPublic, StylableComponent, TamaguiComponent, ThemeValueByCategory, VariantDefinitions, VariantSpreadFunction } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends Object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
export declare function styled<ParentComponent extends StylableComponent, StyledStaticConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledStaticConfig>>(ComponentIn: ParentComponent, options?: Partial<GetProps<ParentComponent>> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    acceptsClassName?: boolean;
}, staticExtractionOptions?: StyledStaticConfig): TamaguiComponent<{
    __tamaDefer: true;
}, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, GetBaseStyles<ParentComponent, StyledStaticConfig> & (StyledStaticConfig["acceptTokens"] extends Object ? { [Key in keyof StyledStaticConfig["acceptTokens"]]?: ThemeValueByCategory<StyledStaticConfig["acceptTokens"][Key]> | undefined; } : {}), AreVariantsUndefined<Variants> extends true ? GetStyledVariants<ParentComponent> : AreVariantsUndefined<GetStyledVariants<ParentComponent>> extends true ? Omit<AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>, "_isEmpty"> : { [Key_1 in Exclude<keyof GetStyledVariants<ParentComponent>, "_isEmpty"> | Exclude<keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>), "_isEmpty">]?: (Key_1 extends keyof GetStyledVariants<ParentComponent> ? GetStyledVariants<ParentComponent>[Key_1] : undefined) | (Key_1 extends keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>) ? (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>)[Key_1] : undefined) | undefined; }, GetStaticConfig<ParentComponent>>;
export {};
//# sourceMappingURL=styled.d.ts.map