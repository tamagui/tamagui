import type { FrontendStaticConfig, StackNonStyleProps, TamaguiElement, TamaguiTextElement, TextNonStyleProps } from '@tamagui/core/internal-runtime';
import type { FunctionComponent, Ref as ReactRef } from 'react';
/**
 * The complete styling surface of a `@tamagui/tailwind` component.
 *
 * Everything else a component accepts is ordinary behavior: children, refs,
 * accessibility, events, ids, and the raw platform `style` escape hatch, all
 * inherited from the shared non-style prop types. Tamagui inline style props
 * (`padding`, `bg`, shorthands, `hoverStyle`, `$sm`, theme style props) are
 * deliberately absent — that authoring syntax belongs to `@tamagui/core`.
 */
export type TailwindStyleProps = {
    className?: string;
};
/** `true`/`false` matchers become a boolean prop; every other matcher is its own literal. */
type VariantAcceptedValue<Key> = Key extends 'true' | 'false' ? boolean : Key;
/**
 * Finite variant inference: one optional prop per variant, accepting exactly the
 * matchers that variant declares. It never reaches core's style prop graph.
 */
export type TailwindVariantProps<Variants> = Variants extends object ? {
    [Key in keyof Variants]?: VariantAcceptedValue<keyof Variants[Key]>;
} : {};
/** Variant values are class strings — the same authoring syntax as `className`. */
export type TailwindVariantDefinitions = {
    [variantName: string]: {
        [matcher: string]: string;
    };
};
export type TailwindCompoundVariant<Variants> = TailwindVariantProps<Variants> & {
    style: string;
};
export type TailwindStyledOptions<Variants extends TailwindVariantDefinitions> = {
    name?: string;
    variants?: Variants;
    defaultVariants?: TailwindVariantProps<Variants>;
    compoundVariants?: readonly TailwindCompoundVariant<Variants>[];
};
export interface TailwindComponent<Ref = any, NonStyleProps = {}, VariantProps = {}> extends FunctionComponent<NonStyleProps & TailwindStyleProps & VariantProps & {
    ref?: ReactRef<Ref>;
}> {
    staticConfig: FrontendStaticConfig;
    /** phantom carrier so `styled()` can recover the parts of a parent component */
    __tailwind?: {
        ref: Ref;
        props: NonStyleProps;
        variants: VariantProps;
    };
}
export type GetTailwindRef<Component> = Component extends TailwindComponent<infer Ref, any, any> ? Ref : any;
export type GetTailwindNonStyleProps<Component> = Component extends TailwindComponent<any, infer Props, any> ? Props : {};
export type GetTailwindVariantProps<Component> = Component extends TailwindComponent<any, any, infer Variants> ? Variants : {};
export type TailwindView = TailwindComponent<TamaguiElement, StackNonStyleProps>;
export type TailwindText = TailwindComponent<TamaguiTextElement, TextNonStyleProps>;
export type TailwindViewProps = StackNonStyleProps & TailwindStyleProps;
export type TailwindTextProps = TextNonStyleProps & TailwindStyleProps;
export {};
//# sourceMappingURL=types.d.ts.map