import type { GetProps } from '@tamagui/core';
import * as React from 'react';
declare const createProgressScope: import("@tamagui/create-context").CreateScope;
export declare const ProgressIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>;
declare const ProgressIndicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const ProgressFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export interface ProgressExtraProps {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
}
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
declare const Progress: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps & React.RefAttributes<import("@tamagui/core").TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ProgressExtraProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    size?: import("@tamagui/core").SizeTokens | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic> & Omit<import("@tamagui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof ProgressExtraProps> & ProgressExtraProps, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & ProgressExtraProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        size?: import("@tamagui/core").SizeTokens | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic];
} & {
    Indicator: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & void, import("@tamagui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@tamagui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/core").StaticConfigPublic>;
};
export { createProgressScope, Progress, ProgressIndicator };
//# sourceMappingURL=Progress.d.ts.map