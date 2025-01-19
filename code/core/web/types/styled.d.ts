import type { StyledContext } from './helpers/createStyledContext';
import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetStaticConfig, GetStyledVariants, GetVariantValues, InferStyledProps, StaticConfigPublic, StylableComponent, TamaDefer, TamaguiComponent, ThemeValueGet, VariantDefinitions, VariantSpreadFunction } from './types';
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
    /** @deprecated pass in instead as the third argument to styled() */
    acceptsClassName?: boolean;
}, staticExtractionOptions?: StyledStaticConfig): TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, StyledStaticConfig["accept"] extends Record<string, any> ? GetBaseStyles<ParentComponent, StyledStaticConfig> & (StyledStaticConfig["accept"] extends Record<string, any> ? { [Key in keyof StyledStaticConfig["accept"]]?: (Key extends keyof GetBaseStyles<ParentComponent, StyledStaticConfig> ? GetBaseStyles<ParentComponent, StyledStaticConfig>[Key] : never) | (StyledStaticConfig["accept"][Key] extends "style" ? Partial<InferStyledProps<ParentComponent, StyledStaticConfig>> : StyledStaticConfig["accept"][Key] extends "textStyle" ? Partial<import("./types").TextProps> : Omit<ThemeValueGet<StyledStaticConfig["accept"][Key]>, "unset">) | undefined; } : {}) : GetBaseStyles<ParentComponent, StyledStaticConfig>, AreVariantsUndefined<Variants> extends true ? GetStyledVariants<ParentComponent> : AreVariantsUndefined<GetStyledVariants<ParentComponent>> extends true ? Omit<AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>, "_isEmpty"> : { [Key_1 in Exclude<keyof GetStyledVariants<ParentComponent>, "_isEmpty"> | Exclude<keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>), "_isEmpty">]?: (Key_1 extends keyof GetStyledVariants<ParentComponent> ? GetStyledVariants<ParentComponent>[Key_1] : undefined) | (Key_1 extends keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>) ? (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>)[Key_1] : undefined) | undefined; }, GetStaticConfig<ParentComponent, StyledStaticConfig>>;
export {};
//# sourceMappingURL=styled.d.ts.map