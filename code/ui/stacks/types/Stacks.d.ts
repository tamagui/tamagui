import type { GetProps, SizeTokens } from '@tamagui/core';
export interface StackVariants {
    elevation?: number | SizeTokens;
}
export type YStackProps = Omit<GetProps<typeof YStack>, keyof StackVariants> & StackVariants;
export type XStackProps = YStackProps;
export type ZStackProps = YStackProps;
/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const YStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const XStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
/**
 * @summary A view that stacks its children on top of each other.
 * @see — Docs https://tamagui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const ZStack: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
}, import("@tamagui/core").StaticConfigPublic & {
    neverFlatten: true;
    isZStack: true;
}>;
//# sourceMappingURL=Stacks.d.ts.map