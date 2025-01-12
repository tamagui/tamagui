import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui';
type ChipIconProps = {
    color?: ColorTokens | string;
    scaleIcon?: number;
    size?: SizeTokens;
    children: React.ReactNode;
};
export declare const Chip: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "size" | keyof import("@tamagui/web").StackStyleBase | "unstyled" | "rounded" | "pressable"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    rounded?: boolean | undefined;
    pressable?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    rounded?: boolean | undefined;
    pressable?: boolean | undefined;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    rounded?: boolean | undefined;
    pressable?: boolean | undefined;
}>> & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    rounded?: boolean | undefined;
    pressable?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        unstyled?: boolean | undefined;
        rounded?: boolean | undefined;
        pressable?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Text: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiTextElement, import("@tamagui/core").RNTamaguiTextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Icon: import("tamagui").TamaguiComponent<Omit<import("@tamagui/web").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
    }>, keyof ChipIconProps> & ChipIconProps, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ChipIconProps, import("@tamagui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Button: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        size?: unknown;
        unstyled?: boolean | undefined;
        alignRight?: boolean | undefined;
        alignLeft?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=chipsParts.d.ts.map