import type { GetProps, SizeTokens } from '@tamagui/core';
export type YStackProps = GetProps<typeof YStack>;
export type XStackProps = YStackProps;
export type ZStackProps = YStackProps;
export declare const fullscreenStyle: {
    readonly position: "absolute";
    readonly top: 0;
    readonly left: 0;
    readonly right: 0;
    readonly bottom: 0;
};
type Insets = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};
export declare const YStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | Insets | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const XStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | Insets | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ZStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    inset?: number | SizeTokens | Insets | null | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic & {
    neverFlatten: true;
    isZStack: true;
}>;
export {};
//# sourceMappingURL=Stacks.d.ts.map