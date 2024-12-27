import type { GetProps, SizeTokens } from '@tamagui/web';
type ButtonVariant = 'outlined';
export type ButtonProps = GetProps<typeof Frame>;
declare const Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiElement, import("@tamagui/web").StackNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    variant?: "outlined" | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export declare const ButtonContext: import("@tamagui/web").StyledContext<{
    size?: SizeTokens;
    variant?: ButtonVariant;
}>;
export declare const Button: import("react").ForwardRefExoticComponent<import("@tamagui/web").GetFinalProps<any, any, {
    size?: SizeTokens;
    variant?: ButtonVariant;
}> & import("react").RefAttributes<any>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, any, any, any, {
    size?: SizeTokens;
    variant?: ButtonVariant;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, any, any, any, {
        size?: SizeTokens;
        variant?: ButtonVariant;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Apply: import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens | undefined;
        variant?: ButtonVariant | undefined;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, any, any, {
        size?: SizeTokens;
        variant?: ButtonVariant;
    }, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, any, any, {
        size?: SizeTokens;
        variant?: ButtonVariant;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Button.d.ts.map