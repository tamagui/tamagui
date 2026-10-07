import { styledDynamic } from './helpers/styledDynamic';
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend';
import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetProps, GetStaticConfig, GetStyledVariants, InferStyledProps, StaticConfigPublic, StylableComponent, StyleOnlyVariants, StyledContext, StyledDynamicFn, StyledDynamicProp, TamaDefer, TamaguiComponent, VariantDefinitions, VariantStyleProps } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends object ? {
    [Key in keyof V]?: V[Key] extends StyledDynamicFn<infer Val, any> ? Val : V[Key] extends StyledDynamicProp<infer Val> ? Val : GetVariantAcceptedValue<keyof V[Key]>;
} : undefined;
type GetVariantAcceptedValue<Key> = Key extends 'true' | 'false' ? boolean : Key;
type NoInferLocal<T> = [T][T extends any ? 0 : never];
type IsAny<T> = 0 extends 1 & T ? true : false;
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type GetStyledOptionsAcceptedProps<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>, Context, ContextPropKeys extends string> = DistributiveOmit<Partial<InferStyledProps<ParentComponent, StyledConfig>>, keyof GetStyledContextVariantProps<ParentComponent, Context, ContextPropKeys> | (AreVariantsUndefined<Variants> extends true ? never : keyof GetVariantAcceptedValues<Variants>)> & (AreVariantsUndefined<Variants> extends true ? {} : Partial<GetVariantAcceptedValues<Variants>>) & GetStyledContextProps<Context, ContextPropKeys>;
export type StyledOptions<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>> = GetStyledOptionsAcceptedProps<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys> & {
    displayName?: string;
    variants?: (Variants & NoInferLocal<StyleOnlyVariants<Variants, keyof VariantStyleProps<ParentComponent, StyledConfig>>>) | undefined;
    defaultVariants?: NoInferLocal<GetVariantAcceptedValues<NonNullable<Variants>>>;
    context?: Context;
    contextProps?: readonly Extract<ContextPropKeys, keyof GetStyledContextAllProps<Context> & string>[];
    render?: string | React.ReactElement;
};
type GetStyledContextAllProps<Context> = Context extends StyledContext<infer Props> ? IsAny<Props> extends true ? {} : Partial<Props> : {};
type GetStyledContextDefaultKeys<Context> = Context extends StyledContext<infer Props, infer Keys> ? IsAny<Props> extends true ? never : Extract<Keys, keyof Props & string> : never;
type GetStyledContextProps<Context, Keys extends string = GetStyledContextDefaultKeys<Context>> = Context extends StyledContext<infer Props> ? IsAny<Props> extends true ? {} : Partial<Pick<Props, Extract<Keys, keyof Props & string>>> : {};
type GetStyledContextVariantProps<ParentComponent extends StylableComponent, Context, Keys extends string, ContextProps = GetStyledContextProps<Context, Keys>, ParentProps = GetProps<ParentComponent>> = {
    [Key in keyof ContextProps as Key extends keyof ParentProps ? Key extends keyof GetBaseStyles<ParentComponent, {}> ? ContextProps[Key] extends ParentProps[Key] ? never : Key : never : Key]: ContextProps[Key];
};
type StyledMergedVariants<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>, ParentVariants = GetStyledVariants<ParentComponent>, OurVariantProps = GetVariantAcceptedValues<Variants>> = AreVariantsUndefined<Variants> extends true ? ParentVariants : AreVariantsUndefined<ParentVariants> extends true ? Omit<OurVariantProps, '_isEmpty'> : {
    [Key in Exclude<keyof ParentVariants | keyof OurVariantProps, '_isEmpty'>]?: (Key extends keyof ParentVariants ? ParentVariants[Key] : undefined) | (Key extends keyof OurVariantProps ? OurVariantProps[Key] : undefined);
};
type StyledVariantsWithContext<Variants, ContextProps> = keyof ContextProps extends never ? Variants : {
    [Key in keyof Variants | keyof ContextProps]?: (Key extends keyof Variants ? Variants[Key] : never) | (Key extends keyof ContextProps ? ContextProps[Key] : never);
};
type StyledComponentResult<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>, ParentStylesBase extends object = GetBaseStyles<ParentComponent, StyledConfig>> = TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, ParentStylesBase, StyledVariantsWithContext<StyledMergedVariants<ParentComponent, StyledConfig, Variants>, GetStyledContextVariantProps<ParentComponent, Context, ContextPropKeys>>, GetStaticConfig<ParentComponent, StyledConfig>>;
/**
 * styled() for creating Tamagui components from other components.
 *
 * Core's public overload is object-only. The class-string form belongs to
 * `@tamagui/tailwind`, which reaches the implementation through
 * `createFrontendStyled`.
 */
declare function styledFn<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>>(ComponentIn: ParentComponent, options?: StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>, config?: StyledConfig): StyledComponentResult<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>;
declare const styled: typeof styledFn & {
    /** see styledDynamic: value/prop carriers usable as `variants` entries */
    dynamic: typeof styledDynamic;
};
/**
 * Builds a `styled()` bound to one frontend descriptor. Components it creates carry
 * that descriptor immutably, so behavior follows import provenance instead of any
 * global setting.
 */
export declare function createFrontendStyled(frontend: StyleFrontend): (ComponentIn: any, optionsOrBaseClassName?: any, configOrOptions?: any, maybeConfig?: any) => FrontendComponent;
export { styled };
//# sourceMappingURL=styled.d.ts.map