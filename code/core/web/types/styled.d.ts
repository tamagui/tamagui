import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type { GetRef } from './interfaces/GetRef';
import type { GetBaseStyles, GetNonStyledProps, GetStaticConfig, GetStyledVariants, GetVariantValues, InferStyleProps, InferStyledProps, StackStyle, StaticConfigPublic, StylableComponent, StyledContext, TamaDefer, TamaguiComponent, TamaguiComponentPropsBase, TextStyle, TextStylePropsBase, ThemeValueGet, VariantDefinitions, VariantSpreadFunction } from './types';
type AreVariantsUndefined<Variants> = Required<Variants> extends {
    _isEmpty: 1;
} ? true : false;
type GetVariantAcceptedValues<V> = V extends object ? {
    [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof V[Key]>;
} : undefined;
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
declare function styled<ParentComponent extends StylableComponent, StyledConfig extends StaticConfigPublic, Variants extends VariantDefinitions<ParentComponent, StyledConfig>>(ComponentIn: ParentComponent, options?: Partial<InferStyledProps<ParentComponent, StyledConfig>> & {
    name?: string;
    variants?: Variants | undefined;
    defaultVariants?: GetVariantAcceptedValues<Variants>;
    context?: StyledContext;
    render?: string | React.ReactElement;
}, config?: StyledConfig): TamaguiComponent<TamaDefer, GetRef<ParentComponent>, GetNonStyledProps<ParentComponent>, StyledConfig["accept"] extends Record<string, any> ? GetBaseStyles<ParentComponent, StyledConfig> & (StyledConfig["accept"] extends Record<string, any> ? { [Key in keyof StyledConfig["accept"]]?: (Key extends keyof GetBaseStyles<ParentComponent, StyledConfig> ? GetBaseStyles<ParentComponent, StyledConfig>[Key] : never) | (StyledConfig["accept"][Key] extends "style" ? Partial<InferStyleProps<ParentComponent, StyledConfig>> : StyledConfig["accept"][Key] extends "textStyle" ? Partial<InferStyleProps<TamaguiComponent<import("./types").TextProps, import("./types").TamaguiTextElement, import("./types").TextNonStyleProps, TextStylePropsBase, {}>, StyledConfig>> : Omit<ThemeValueGet<StyledConfig["accept"][Key]>, "unset">) | undefined; } : {}) : GetBaseStyles<ParentComponent, StyledConfig>, AreVariantsUndefined<Variants> extends true ? GetStyledVariants<ParentComponent> : AreVariantsUndefined<GetStyledVariants<ParentComponent>> extends true ? Omit<AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>, "_isEmpty"> : { [Key_1 in Exclude<keyof GetStyledVariants<ParentComponent>, "_isEmpty"> | Exclude<keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>), "_isEmpty">]?: (Key_1 extends keyof GetStyledVariants<ParentComponent> ? GetStyledVariants<ParentComponent>[Key_1] : undefined) | (Key_1 extends keyof (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>) ? (AreVariantsUndefined<Variants> extends true ? {} : GetVariantAcceptedValues<Variants>)[Key_1] : undefined) | undefined; }, GetStaticConfig<ParentComponent, StyledConfig>>;
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