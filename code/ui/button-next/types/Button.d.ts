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
export declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | "elevation" | keyof import("@tamagui/web").StackStyleBase | "transparent" | "fullscreen" | "circular" | "backgrounded" | "radiused" | "hoverTheme" | "pressTheme" | "focusTheme" | "padded" | "elevate" | "bordered" | "chromeless" | "unstyled"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    padded?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    unstyled?: boolean | undefined;
}>> & {
    iconSize?: SizeTokens;
    scaleIcon?: number;
} & import("react").RefAttributes<any>> & import("@tamagui/web").StaticComponentObject<import("./createButton").ButtonFrameProps, any, any, any, {
    size?: SizeTokens;
    variant?: ButtonVariant;
}, {}> & Omit<{}, "staticConfig" | "styleable"> & {
    __tama: [import("./createButton").ButtonFrameProps, any, any, any, {
        size?: SizeTokens;
        variant?: ButtonVariant;
    }, {}];
} & {
    Apply: import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens | undefined;
        variant?: ButtonVariant | undefined;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
    Text: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, any, unknown, unknown, unknown, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=Button.d.ts.map