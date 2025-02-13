import type { GetProps, SizeTokens } from '@tamagui/web';
type ButtonVariant = 'outlined';
export type ButtonProps = GetProps<typeof Frame>;
declare const Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ButtonContext: import("@tamagui/web").StyledContext<{
    size?: SizeTokens;
    variant?: ButtonVariant;
}>;
export declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "size" | "variant" | "icon" | "iconAfter" | "scaleIcon" | "iconSize"> & {
    variant?: "outlined";
    size?: SizeTokens;
    icon?: any;
    iconAfter?: any;
    scaleIcon?: number;
    iconSize?: SizeTokens;
} & import("react").RefAttributes<import("@tamagui/web").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, "size" | "variant" | "icon" | "iconAfter" | "scaleIcon" | "iconSize"> & {
    variant?: "outlined";
    size?: SizeTokens;
    icon?: any;
    iconAfter?: any;
    scaleIcon?: number;
    iconSize?: SizeTokens;
}, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & {
    variant?: "outlined";
    size?: SizeTokens;
    icon?: any;
    iconAfter?: any;
    scaleIcon?: number;
    iconSize?: SizeTokens;
}, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, "size" | "variant" | "icon" | "iconAfter" | "scaleIcon" | "iconSize"> & {
        variant?: "outlined";
        size?: SizeTokens;
        icon?: any;
        iconAfter?: any;
        scaleIcon?: number;
        iconSize?: SizeTokens;
    }, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps & {
        variant?: "outlined";
        size?: SizeTokens;
        icon?: any;
        iconAfter?: any;
        scaleIcon?: number;
        iconSize?: SizeTokens;
    }, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").ProviderExoticComponent<Partial<{
        size: undefined;
        variant: undefined;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: import("@tamagui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Button.d.ts.map