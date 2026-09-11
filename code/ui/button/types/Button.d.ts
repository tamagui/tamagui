import type { TextParentStyles } from '@tamagui/text';
import { textParentProps } from '@tamagui/text';
import type { GetProps, TamaguiComponentPropsBaseBase } from '@tamagui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
export declare const ButtonFrame: FunctionComponent<Omit<import("@tamagui/web").StackNonStyleProps, "disabled" | keyof import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & import("@tamagui/web").WithFlatVariantValues<{
    disabled?: boolean | undefined;
}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    disabled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        disabled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
};
export declare const ButtonText: FunctionComponent<Omit<import("@tamagui/web").TextNonStyleProps, keyof import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase> & import("@tamagui/web").WithFlatVariantValues<{}> & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").TextStylePropsBase>> & {
    ref?: import("react").Ref<import("@tamagui/web").TamaguiTextElement> | undefined;
}> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {}, import("@tamagui/web").StaticConfigPublic];
};
export type ButtonIconProps = {
    children: ReactNode;
    color?: string;
    scaleIcon?: number;
    size?: number;
};
export declare const ButtonIcon: ({ children, color, scaleIcon, size }: ButtonIconProps) => any;
type ButtonIconInput = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | ((props: {
    color?: any;
    size?: any;
}) => ReactNode) | null;
/**
 * The props `useButton` reads and replaces. It hands the frame everything else
 * untouched, so this is exactly what its result omits.
 */
type ButtonConsumedProps = {
    children?: ReactNode;
    disabled?: boolean;
    render?: TamaguiComponentPropsBaseBase['render'];
    icon?: ButtonIconInput;
    iconAfter?: ButtonIconInput;
    iconSize?: number;
    scaleIcon?: number;
};
/** passed straight through to the rendered `<button>` */
type ButtonHTMLProps = {
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
};
export type ButtonBehaviorProps = TextParentStyles & ButtonConsumedProps & ButtonHTMLProps;
/**
 * What `useButton` returns: the caller's props minus the ones it consumed, plus
 * the ones it decides. Spelled out rather than cast, so a skin that spreads the
 * result onto a frame is type-checked on exactly what it will receive.
 */
export type UseButtonProps<Props> = Omit<Omit<Props, keyof TextParentStyles | keyof typeof textParentProps>, keyof ButtonConsumedProps> & {
    children: ReactNode;
    'aria-disabled'?: boolean;
    disabled?: boolean;
    render?: TamaguiComponentPropsBaseBase['render'];
    tabIndex?: number;
};
export type UseButtonOptions = {
    Text?: any;
    iconColor?: string;
    iconSize?: number;
    textProps?: Record<string, unknown>;
};
/**
 * Button behavior: icon theming, wrapping bare children in a text, and the html
 * nesting rules. Flat text styles are partitioned in one pass and handed to the
 * wrapped text, with no style resolution hook or text context.
 */
export declare function useButton<Props extends ButtonBehaviorProps>(propsIn: Props, { Text, iconColor, iconSize: iconSizeOption, textProps: textPropsOption, }?: UseButtonOptions): {
    isNested: boolean;
    props: UseButtonProps<Props>;
};
export type ButtonFrameProps = GetProps<typeof ButtonFrame>;
export {};
//# sourceMappingURL=Button.d.ts.map