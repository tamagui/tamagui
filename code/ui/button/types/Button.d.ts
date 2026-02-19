import type { ColorTokens, GetProps, SizeTokens } from '@tamagui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
export declare const ButtonContext: import("@tamagui/web").StyledContext<{
    size?: SizeTokens;
    variant?: ButtonVariant;
    color?: ColorTokens | string;
}>;
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
type ButtonExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
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
declare const ButtonComponent: import("@tamagui/web").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & ButtonExtraProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & ButtonExtraProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof ButtonExtraProps> & ButtonExtraProps, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & ButtonExtraProps, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: SizeTokens;
        variant?: ButtonVariant;
        color?: ColorTokens | string;
        elevation?: SizeTokens | number;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens;
        variant?: ButtonVariant;
        color?: ColorTokens | string;
        elevation?: SizeTokens | number;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Icon: (props: {
        children: React.ReactNode;
        scaleIcon?: number;
        size?: SizeTokens;
    }) => any;
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map