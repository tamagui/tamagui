import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetStaticConfig, GetStyledVariants, GetVariantValues, InferStyledProps, StaticConfigPublic, StylableComponent, StyledContext, TamaDefer, TamaguiComponent, ThemeValueGet, VariantDefinitions, VariantSpreadFunction } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends Object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
export declare function styled<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>>(ComponentIn: ParentComponent, options?: Partial<InferStyledProps<ParentComponent, StyledConfig>> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    /** @deprecated pass in instead as the third argument to styled() */
    acceptsClassName?: boolean;
}, config?: StyledConfig): TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, StyledConfig["accept"] extends Record<string, any> ? GetBaseStyles<ParentComponent, StyledConfig> & (StyledConfig["accept"] extends Record<string, any> ? { [Key in keyof StyledConfig["accept"]]?: (Key extends keyof GetBaseStyles<ParentComponent, StyledConfig> ? GetBaseStyles<ParentComponent, StyledConfig>[Key] : never) | (StyledConfig["accept"][Key] extends "style" ? Partial<InferStyledProps<ParentComponent, StyledConfig>> : StyledConfig["accept"][Key] extends "textStyle" ? Partial<import("./types").TextProps> : Omit<ThemeValueGet<StyledConfig["accept"][Key]>, "unset">) | undefined; } : {}) : GetBaseStyles<ParentComponent, StyledConfig>, AreVariantsUndefined<Variants> extends true ? GetStyledVariants<ParentComponent> : AreVariantsUndefined<GetStyledVariants<ParentComponent>> extends true ? Omit<AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>, "_isEmpty"> : { [Key_1 in Exclude<keyof GetStyledVariants<ParentComponent>, "_isEmpty"> | Exclude<keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>), "_isEmpty">]?: (Key_1 extends keyof GetStyledVariants<ParentComponent> ? GetStyledVariants<ParentComponent>[Key_1] : undefined) | (Key_1 extends keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>) ? (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>)[Key_1] : undefined) | undefined; }, GetStaticConfig<ParentComponent, StyledConfig>>;
export {};
//# sourceMappingURL=styled.d.ts.map