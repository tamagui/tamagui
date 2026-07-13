import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { GetRef } from './interfaces/GetRef';
import type { CompoundVariantDefinition, GetBaseStyles, GetNonStyledProps, GetStaticConfig, GetStyledVariants, GetVariantValues, InferStyleProps, InferStyledProps, StackStyle, StaticConfigPublic, StylableComponent, StyledContext, TamaDefer, TamaguiComponent, TamaguiComponentPropsBase, TextStyle, ThemeValueByCategory, VariantDefinitions, VariantSpreadFunction } from './types';
import type { Text } from './views/Text';
export { createVariantResolver } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
type NoInferLocal<T> = [T][T extends any ? 0 : never];
type IsAny<T> = 0 extends 1 & T ? true : false;
export type StyledOptions<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig> | undefined, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>> = Partial<InferStyledProps<ParentComponent, StyledConfig>> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: NoInferLocal<GetVariantAcceptedValues<NonNullable<Variants>>>;
    context?: Context;
    contextProps?: readonly Extract<ContextPropKeys, keyof GetStyledContextAllProps<Context> & string>[];
    compoundVariants?: readonly CompoundVariantDefinition<NoInferLocal<GetCompoundVariantMatchProps<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>>, Partial<InferStyleProps<ParentComponent, StyledConfig>>>[];
    render?: string | React.ReactElement;
};
type GetStyledContextAllProps<Context> = Context extends StyledContext<infer Props> ? IsAny<Props> extends true ? {} : Partial<Props> : {};
type GetStyledContextDefaultKeys<Context> = Context extends StyledContext<infer Props, infer Keys> ? IsAny<Props> extends true ? never : Extract<Keys, keyof Props & string> : never;
type GetStyledContextProps<Context, Keys extends string = GetStyledContextDefaultKeys<Context>> = Context extends StyledContext<infer Props> ? IsAny<Props> extends true ? {} : Partial<Pick<Props, Extract<Keys, keyof Props & string>>> : {};
type GetCompoundVariantMatchProps<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants, Context, ContextPropKeys extends string> = Omit<StyledMergedVariants<ParentComponent, StyledConfig, Variants extends VariantDefinitions<ParentComponent, StyledConfig> ? Variants : undefined>, '_isEmpty'> & GetStyledContextProps<Context, ContextPropKeys>;
type StyledCustomTokenProps<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, ParentStylesBase extends object, Accepted = StyledConfig['accept']> = Accepted extends Record<string, any> ? {
    [Key in keyof Accepted]?: (Key extends keyof ParentStylesBase ? ParentStylesBase[Key] : never) | (Accepted[Key] extends 'style' ? Partial<InferStyleProps<ParentComponent, StyledConfig>> : Accepted[Key] extends 'textStyle' ? Partial<InferStyleProps<typeof Text, StyledConfig>> : ThemeValueByCategory<Accepted[Key]>);
} : {};
type StyledMergedVariants<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig> | undefined, ParentVariants = GetStyledVariants<ParentComponent>, OurVariantProps = GetVariantAcceptedValues<NonNullable<Variants>>> = AreVariantsUndefined<NonNullable<Variants>> extends true ? ParentVariants : AreVariantsUndefined<ParentVariants> extends true ? Omit<OurVariantProps, '_isEmpty'> : {
    [Key in Exclude<keyof ParentVariants | keyof OurVariantProps, '_isEmpty'>]?: (Key extends keyof ParentVariants ? ParentVariants[Key] : undefined) | (Key extends keyof OurVariantProps ? OurVariantProps[Key] : undefined);
};
type StyledComponentResult<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig> | undefined, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>, ParentStylesBase extends object = GetBaseStyles<ParentComponent, StyledConfig>, Accepted = StyledConfig['accept']> = TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent> & GetStyledContextProps<Context, ContextPropKeys>, Accepted extends Record<string, any> ? ParentStylesBase & StyledCustomTokenProps<ParentComponent, StyledConfig, ParentStylesBase, Accepted> : ParentStylesBase, StyledMergedVariants<ParentComponent, StyledConfig, Variants>, GetStaticConfig<ParentComponent, StyledConfig>>;
type TextLikeElements = 'a' | 'abbr' | 'b' | 'bdi' | 'bdo' | 'cite' | 'code' | 'data' | 'del' | 'dfn' | 'em' | 'i' | 'ins' | 'kbd' | 'label' | 'mark' | 'q' | 's' | 'samp' | 'small' | 'span' | 'strong' | 'sub' | 'sup' | 'time' | 'u' | 'var';
type ConflictingHTMLProps = 'color' | 'display' | 'height' | 'width' | 'size' | 'left' | 'right' | 'top' | 'bottom' | 'translate' | 'content';
type HTMLElementSpecificProps<T extends keyof HTMLElementTagNameMap> = T extends 'a' ? Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingHTMLProps> : T extends 'button' ? Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHTMLProps> : T extends 'input' ? Omit<InputHTMLAttributes<HTMLInputElement>, ConflictingHTMLProps> : T extends 'select' ? Omit<SelectHTMLAttributes<HTMLSelectElement>, ConflictingHTMLProps> : T extends 'textarea' ? Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, ConflictingHTMLProps> : T extends 'form' ? Omit<FormHTMLAttributes<HTMLFormElement>, ConflictingHTMLProps> : T extends 'label' ? Omit<LabelHTMLAttributes<HTMLLabelElement>, ConflictingHTMLProps> : Omit<HTMLAttributes<HTMLElement>, ConflictingHTMLProps>;
type HTMLElementStyleBase<T extends keyof HTMLElementTagNameMap> = T extends TextLikeElements ? TextStyle : StackStyle;
/**
 * styledHtml() for HTML element tags like 'a', 'button', 'div', etc.
 * Automatically provides element-specific props (href for anchors, type for buttons, etc.)
 *
 * @example
 * const StyledAnchor = styledHtml('a', {
 *   color: '$blue10',
 *   textDecorationLine: 'underline',
 * })
 * // StyledAnchor now accepts `href` prop with proper typing
 * <StyledAnchor href="/path">Link</StyledAnchor>
 */
export declare function styledHtml<Tag extends keyof HTMLElementTagNameMap, Variants extends VariantDefinitions<any, any> | undefined = undefined>(tag: Tag, options?: Partial<HTMLElementStyleBase<Tag>> & {
    name?: string;
    variants?: Variants;
    defaultVariants?: GetVariantAcceptedValues<NonNullable<Variants>>;
    context?: StyledContext;
}): TamaguiComponent<TamaDefer, HTMLElementTagNameMap[Tag], TamaguiComponentPropsBase & HTMLElementSpecificProps<Tag>, HTMLElementStyleBase<Tag>, Variants extends undefined ? {} : AreVariantsUndefined<NonNullable<Variants>> extends true ? {} : GetVariantAcceptedValues<NonNullable<Variants>>, {}>;
/**
 * styled() for creating Tamagui components from other components.
 */
declare function styled<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig> | undefined = undefined, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>>(ComponentIn: ParentComponent, options?: StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>, config?: StyledConfig): StyledComponentResult<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>;
declare function styled<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig> | undefined = undefined, Context extends StyledContext<any> | undefined = undefined, ContextPropKeys extends string = GetStyledContextDefaultKeys<Context>>(ComponentIn: ParentComponent, baseClassName: string, options?: StyledOptions<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>, config?: StyledConfig): StyledComponentResult<ParentComponent, StyledConfig, Variants, Context, ContextPropKeys>;
type StyledHtmlFactory<Tag extends keyof HTMLElementTagNameMap> = <Variants extends VariantDefinitions<any, any> | undefined = undefined>(options?: Partial<HTMLElementStyleBase<Tag>> & {
    name?: string;
    variants?: Variants;
    defaultVariants?: GetVariantAcceptedValues<NonNullable<Variants>>;
    context?: StyledContext;
}) => TamaguiComponent<TamaDefer, HTMLElementTagNameMap[Tag], TamaguiComponentPropsBase & HTMLElementSpecificProps<Tag>, HTMLElementStyleBase<Tag>, Variants extends undefined ? {} : AreVariantsUndefined<NonNullable<Variants>> extends true ? {} : GetVariantAcceptedValues<NonNullable<Variants>>, {}>;
type StyledHtmlFactories = {
    [K in keyof HTMLElementTagNameMap]: StyledHtmlFactory<K>;
};
declare const styledExport: typeof styled & StyledHtmlFactories;
export { styledExport as styled };
//# sourceMappingURL=styled.d.ts.map